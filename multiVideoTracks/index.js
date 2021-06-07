var mediaSource1 = null,
  mediaSource2 = null,
  mimeCodec1 = 'video/mp4; codecs="avc1.640028,avc1.640029,mp4a.40.2"', //avc1.4D401F mp4a.40.2
  mimeCodec2 = 'video/mp4; codecs="avc1.640028,avc1.640029,mp4a.40.2"',
  videoBuffer1 = null,
  track1Buffer = [],
  videoBuffer2 = null,
  track2Buffer = [],
  iSOFile = null,
  assetURL = './multiVideoFrag.mp4',
  rangeLength = 5 * 1024 * 1024,
  // mp4FullBuffer:
  hasRerequest = false,
  mp4FileLength = 0

 iSOFile = new window.parseISOFile( processParsedDataCallBack)
 initMSE()

function appendFetchBuffer(buffer) {
  // let buffer = new Uint8Array(arrBuf).buffer
  buffer.fileStart = 0
  iSOFile.appendBuffer(buffer)
}

function processParsedDataCallBack({ boxInfo = {}, arrayBuffer, error = {} }) {
  if (0 === error.errorCode) {
    //长度不够了，需要重新请求数据
    hasRerequest = true
    let rangeEnd =
      error.nextRangeStart + rangeLength <= mp4FileLength
        ? error.nextRangeStart + rangeLength
        : mp4FileLength
    fetchRange(assetURL, error.nextRangeStart, rangeEnd, appendFetchBuffer)
  }
  if ('moov' === boxInfo.type) {
    //解析自定义数据
    if (
      boxInfo.box &&
      boxInfo.box.traks[0] &&
      boxInfo.box.traks[0].meta &&
      boxInfo.box.traks[0].meta['xml ']
    ) {
      let businessData = JSON.parse(
        String.fromCodePoint
          .apply(null, boxInfo.box.traks[0].meta['xml '].data)
          .replaceAll('\u0000', '')
      )
      console.log('====businessData:', businessData)
    }

    //1.检查当前要播放的是video track是哪个
    //track1
    // videoBuffer1.appendBuffer(new Uint8Array(arrayBuffer.slice(0, boxInfo.start + boxInfo.size)))
    videoBuffer1.appendBuffer(arrayBuffer.slice(0, boxInfo.start + boxInfo.size))

    //track3
    let moovBuffer = arrayBuffer.slice(0, boxInfo.start + boxInfo.size)

    let tracks = boxInfo.box.traks
    let track3 = tracks[0]
    let track2 = tracks[1]
    let track1 = tracks[2]
    const { start: track3Start, size: track3Size } = track3
    const { start: track2Start, size: track2Size } = track2
    const { start: track1Start, size: track1Size } = track1

    let header = moovBuffer.slice(0, track3Start)
    let track3Buffer = moovBuffer.slice(track3Start, track3Start + track3Size)
    let track2Buffer = moovBuffer.slice(track2Start, track2Start + track2Size)
    let track1Buffer = moovBuffer.slice(track1Start, track1Start + track1Size)

    let uint8Array = new Uint8Array(moovBuffer.byteLength)
    uint8Array.set(new Uint8Array(header), 0)
    uint8Array.set(new Uint8Array(track1Buffer), track3Start)
    uint8Array.set(new Uint8Array(track2Buffer), track3Start + +track1Size)
    uint8Array.set(new Uint8Array(track3Buffer), track3Start + track1Size + track2Size)

    videoBuffer2.appendBuffer(uint8Array.buffer)
  }
  if ('moof_mdat' === boxInfo.type) {
    if (1 === boxInfo.trackId || 2 === boxInfo.trackId) {
      if (hasRerequest) {
        //重新请求后，不会在触发updateend，需要主动提交一次
        videoBuffer1.appendBuffer(
          arrayBuffer.slice(boxInfo.start, boxInfo.start + boxInfo.size)
        )
        hasRerequest = false
      } else {
        track1Buffer.push(arrayBuffer.slice(boxInfo.start, boxInfo.start + boxInfo.size))
      }
    }

    if (3 === boxInfo.trackId || 2 === boxInfo.trackId) {
      if (hasRerequest) {
        //重新请求后，不会在触发updateend，需要主动提交一次
        videoBuffer2.appendBuffer(
          arrayBuffer.slice(boxInfo.start, boxInfo.start + boxInfo.size)
        )
        hasRerequest = false
      } else {
        track2Buffer.push(arrayBuffer.slice(boxInfo.start, boxInfo.start + boxInfo.size))
      }
    }
  }
}
function initMSE() {
  let video = document.querySelector('video#mp4boxVideo1')
  let video2 = document.querySelector('video#mp4boxVideo2')

  if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec1)) {
    // video1
    mediaSource1 = new MediaSource()
    //console.log(mediaSource.readyState); // closed
    video.src = URL.createObjectURL(mediaSource1)
    video.mediaSource = mediaSource1
    mediaSource1.addEventListener('sourceopen', onSourceOpen)

    // video2
    mediaSource2 = new MediaSource()
    //console.log(mediaSource.readyState); // closed
    video2.src = URL.createObjectURL(mediaSource2)
    video2.mediaSource = mediaSource2
    mediaSource2.addEventListener('sourceopen', onSourceOpen2)
  } else {
    console.error('Unsupported MIME type or codec: ', mimeCodec2)
    return
  }
}
function getFileLength(url, cb) {
  var xhr = new XMLHttpRequest()
  xhr.open('head', url)
  xhr.onload = function() {
    cb(xhr.getResponseHeader('content-length'))
  }
  xhr.send()
}
function fetchRange(url, start, end, cb) {
  var xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.responseType = 'arraybuffer'
  xhr.setRequestHeader('Range', 'bytes=' + start + '-' + end)
  xhr.onload = function() {
    console.log('fetched bytes: ', start, end)
    cb(xhr.response)
  }
  xhr.send()
}
function seet1() {
  let mediaSource = mediaSource1
  if (mediaSource.readyState === 'open') {
    videoBuffer1.abort()
    console.log(mediaSource.readyState)
  } else {
    console.log(mediaSource.readyState)
  }
}
function onSourceOpen() {
  let _self = this
  let mediaSource = mediaSource1
  videoBuffer1 = mediaSource.addSourceBuffer(mimeCodec1)
  let video = document.querySelector('video#mp4boxVideo1')
  getFileLength(assetURL, fileLength => {
    mp4FileLength = fileLength
    console.log(fileLength, (fileLength / 1024 / 1024).toFixed(2), 'MB')
    fetchRange(assetURL, 0, rangeLength, appendFetchBuffer)

    videoBuffer1.addEventListener('update', () => {})
    videoBuffer1.addEventListener('updateend', () => {
      if (_self.track1Buffer.length > 0 && !_self.track1Buffer.updating) {
        _self.videoBuffer1.appendBuffer(_self.track1Buffer.shift())
      }
    })

    video.addEventListener('seeking', seet1)

    video.addEventListener('canplay', function() {
      // segmentDuration = video.duration / totalSegments
      video.play()
    })
  })
}
function onSourceOpen2() {
  let _self = this
  let mediaSource = mediaSource2
  videoBuffer2 = mediaSource.addSourceBuffer(mimeCodec2)
  let video = document.querySelector('video#mp4boxVideo2')

  videoBuffer2.addEventListener('update', function() {
    // console.log('update...2222')
  })

  videoBuffer2.addEventListener('updateend', () => {
    if (_self.track2Buffer.length > 0 && !_self.track2Buffer.updating) {
      _self.videoBuffer2.appendBuffer(_self.track2Buffer.shift())
    }
  })
  video.addEventListener('canplay', function() {
    video.play()
  })
}
