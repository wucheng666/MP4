var fileobj = {},
  chunkSize = 1024 * 1024, // bytes
  mediaSource1 = null,
  mediaSource2 = null,
  mimeCodec = 'video/mp4; codecs="avc1.4D401F, mp4a.40.2"', //avc1.4D401F mp4a.40.2
  mimeCodec2 = 'video/mp4; codecs="mp4a.40.2,avc1.42e01e,avc1.4d401f"',
  videoBuffer1 = null,
  videoBuffer2 = null

//   window.addEventListener("load", init);

async function receivedData(response, file, fileList) {
  if(!fileobj.mp4boxfile){
    fileobj.mp4boxfile = MP4Box.createFile(false)
  }

  console.log('upload success...')
  console.log(response, file, fileList)
  fileobj = Object.assign(fileobj, { objectToLoad: response.files[0] })
  let parseMp4BoxObj = await parseFile(fileobj)

  //设置MIME Codec
  if(!mimeCodec1){
    mimeCodec1 = `video/mp4; codecs="${fileobj.mp4boxfile.getCodecs()}"`
  }
  if(!mimeCodec2){
    mimeCodec2 = `video/mp4; codecs="${fileobj.mp4boxfile.getCodecs()}"`
  }

  console.log(2222, mimeCodec1)
  console.log(parseMp4BoxObj)
  //解析blob数据
  mse()
}

function parseFile(fileobj) {
  let self = this
  return new Promise((resolve, reject) => {
    let fileSize = fileobj.objectToLoad.size
    let offset = 0
    let readBlock = null

    fileobj.mp4boxfile.onError = function(e) {
      console.log('Failed to parse ISOBMFF data')
    }

    fileobj.mp4boxfile.onSidx = function(sidx) {
      console.log(sidx)
    }

    let onparsedbuffer = function(mp4boxfileobj, buffer) {
      buffer.fileStart = offset
      mp4boxfileobj.appendBuffer(buffer)
    }

    let onBlockRead1 = function(evt) {
      if (evt.target.error == null) {
        onparsedbuffer(fileobj.mp4boxfile, evt.target.result) // callback for handling read chunk
        offset += evt.target.result.byteLength
      } else {
        console.log('Read error: ' + evt.target.error)
        return reject('Read error: ' + evt.target.error)
      }
      if (offset >= fileSize) {
        // console.log(
        //   'Done reading file (' + fileSize + ' bytes) in ' + (new Date() - startDate) + ' ms'
        // )
        fileobj.mp4boxfile.flush()
        return resolve(fileobj)
      }

      readBlock(offset, self.chunkSize, fileobj.objectToLoad)
    }

    readBlock = function(_offset, length, _file) {
      let r = new FileReader()
      let blob = _file.slice(_offset, length + _offset)
      r.onload = onBlockRead1
      r.readAsArrayBuffer(blob)
    }

    readBlock(offset, self.chunkSize, fileobj.objectToLoad)
  })
}

function mse() {
  let video = document.querySelector('video#mp4boxVideo1')
  let video2 = document.querySelector('video#mp4boxVideo2')

  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec1)) {
    // video1
    mediaSource1 = new MediaSource()
    video.src = URL.createObjectURL(mediaSource1)
    video.mediaSource = mediaSource1
    mediaSource1.addEventListener('sourceopen', onSourceOpen)

    // video2
    mediaSource2 = new MediaSource()
    video2.src = URL.createObjectURL(mediaSource2)
    video2.mediaSource = mediaSource2
    mediaSource2.addEventListener('sourceopen', onSourceOpen2)
  } else {
    console.error('Unsupported MIME type or codec: ', mimeCodec2)
    return
  }
}
function onSourceOpen() {
  let mediaSource = mediaSource1
  videoBuffer1 = mediaSource.addSourceBuffer(mimeCodec1)
  let video = document.querySelector('video#mp4boxVideo1')

  videoBuffer1.addEventListener('update', function() {
    console.log('update...111')
    // if (queue.length > 0 && !buffer.updating) {
    //     console.log("update...22")
    //     console.log("buffer.appendBuffer");
    //     buffer.appendBuffer(queue.shift());
    // }
  })
  video.addEventListener('canplay', function() {
    console.log('play...111')
    // segmentDuration = video.duration / totalSegments
    video.play()
  })
  parseAndAppendFile()
}
function onSourceOpen2() {
  let mediaSource = mediaSource2
  videoBuffer2 = mediaSource.addSourceBuffer(mimeCodec2)
  let video = document.querySelector('video#mp4boxVideo2')

  videoBuffer2.addEventListener('update', function() {
    console.log('update...2222')
  })
  video.addEventListener('canplay', function() {
    console.log('canplay...2222')
    video.play()
  })

  parseAndAppendFile2()
}
function parseAndAppendFile() {
  let _self = this

  let { mp4boxfile, objectToLoad } = fileobj
  let { moov, moofs, mdats, lastMoofIndex, lastBoxStartPosition } = mp4boxfile

  //读取：从 0 - moov.size结束
  // let fileReader = new FileReader()
  let onBlockRead = function(shouldModifyTrackId, moofStart, tfhdStart, tfhdSize, evt) {
    if (evt.target.error == null) {

      let uint8Array = new Uint8Array(evt.target.result)

      _self.videoBuffer1.appendBuffer(uint8Array)
    } else {
      console.log('Read error: ' + evt.target.error)
      return reject('Read error: ' + evt.target.error)
    }
  }

  let onBlockRead2 = function(moov, evt) {
    if (evt.target.error == null) {
      let result = evt.target.result

      let tracks = moov.traks
      let track3 = tracks[0]
      let track2 = tracks[1]
      let track1 = tracks[2]
      const { start: track3Start, size: track3Size } = track3
      const { start: track2Start, size: track2Size } = track2
      const { start: track1Start, size: track1Size } = track1

      let header = result.slice(0, track3Start)
      let track3Buffer = result.slice(track3Start, track3Start + track3Size)
      let track2Buffer = result.slice(track2Start, track2Start + track2Size)
      let track1Buffer = result.slice(track1Start, track1Start + track1Size)

      let uint8Array = new Uint8Array(evt.target.result.byteLength)
      uint8Array.set(new Uint8Array(header), 0)
      uint8Array.set(new Uint8Array(track1Buffer), track3Start)
      uint8Array.set(new Uint8Array(track2Buffer), track3Start + +track1Size)
      uint8Array.set(new Uint8Array(track3Buffer), track3Start + track1Size + track2Size)

      _self.videoBuffer1.appendBuffer(uint8Array)
    } else {
      console.log('Read error: ' + evt.target.error)
      return reject('Read error: ' + evt.target.error)
    }
  }

  let r = new FileReader()
  let blob = objectToLoad.slice(0, moov.start + moov.size)
  r.onload = onBlockRead2.bind(this, moov)
  r.readAsArrayBuffer(blob)

  for (let i = 0; i < lastMoofIndex; i++) {
    //一次读取moof + mdat 一组数据
    ;(() => {
      setTimeout(() => {
        let videoTrackId = getMoofTrackId(moofs[i])

        if (videoTrackId === 1 || videoTrackId === 2) {
          //一次读取moof + mdat 一组数据
          let moof_mdat_start = moofs[i].start
          let moof_mdat_end = moofs[i].start + moofs[i].size + mdats[i].size
          const { start: tfhdStart, size: tfhdSize } = moofs[i].trafs[0].tfhd
          let r1 = new FileReader()
          let blob = objectToLoad.slice(moof_mdat_start, moof_mdat_end)
          r1.onload = onBlockRead.bind(this, true, moofs[i].start, tfhdStart, tfhdSize)
          // r1.onload = onBlockRead
          r1.readAsArrayBuffer(blob)
        }
      }, i * 100)
    })()
  }
}

function parseAndAppendFile2() {
  let _self = this

  let { mp4boxfile, objectToLoad } = fileobj
  let { moov, moofs, mdats, lastMoofIndex, lastBoxStartPosition } = mp4boxfile

  //读取：从 0 - moov.size结束
  // let fileReader = new FileReader()
  let onBlockRead = function(shouldModifyTrackId, moovStart, tfhdStart, tfhdSize, evt) {
    // let onBlockRead = function (evt) {
    if (evt.target.error == null) {
      let uint8Array = new Uint8Array(evt.target.result)
      if (shouldModifyTrackId) {
        let modifyIndex = tfhdStart - moovStart + tfhdSize - 4 + 3
        let view = new DataView(uint8Array)
        view.setInt8(modifyIndex, 3)
        // uint8Array[modifyIndex] = 3
      }

      _self.videoBuffer2.appendBuffer(uint8Array)
    } else {
      console.log('Read error: ' + evt.target.error)
      return reject('Read error: ' + evt.target.error)
    }
  }

  let r = new FileReader()
  let blob1 = objectToLoad.slice(0, moov.start + moov.size)
  r.onload = onBlockRead.bind(this, false, 0, 0, 0)
  r.readAsArrayBuffer(blob1)

  for (let i = 0; i < lastMoofIndex; i++) {
    //一次读取moof + mdat 一组数据

    ;(() => {
      setTimeout(() => {
        let videoTrackId = getMoofTrackId(moofs[i])

        if (videoTrackId === 3 || videoTrackId === 2) {
          //一次读取moof + mdat 一组数据
          let moof_mdat_start = moofs[i].start
          let moof_mdat_end = moofs[i].start + moofs[i].size + mdats[i].size
          const { start: tfhdStart, size: tfhdSize } = moofs[i].trafs[0].tfhd
          let r1 = new FileReader()
          let blob = objectToLoad.slice(moof_mdat_start, moof_mdat_end)
          r1.onload = onBlockRead.bind(this, false, moov.start, tfhdStart, tfhdSize)
          r1.readAsArrayBuffer(blob)
        }
      }, i * 100)
    })()
  }
}

function getMoofTrackId(moov = null) {
  if (!moov) {
    return
  }
  return moov.trafs[0].tfhd.track_id
}
