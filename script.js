(function(){
    var script = {
 "horizontalAlign": "left",
 "children": [
  "this.MainViewer",
  "this.Container_6E5D8FA2_6130_F451_41D1_1BF0E97B60CB",
  "this.Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48",
  "this.Container_0A760F11_3BA1_BFAE_41CD_32268FCAF8B4",
  "this.Container_1B99BD00_16C4_0505_41A4_A3C2452B0288",
  "this.Container_062AB830_1140_E215_41AF_6C9D65345420",
  "this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
  "this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
  "this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
  "this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
  "this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC"
 ],
 "layout": "absolute",
 "id": "rootPlayer",
 "buttonToggleFullscreen": "this.Button_4CF1FD24_5A86_3DF2_41B3_7CDBA2E3D44A",
 "defaultVRPointer": "laser",
 "scripts": {
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "registerKey": function(key, value){  window[key] = value; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "existsKey": function(key){  return key in window; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getKey": function(key){  return window[key]; },
  "unregisterKey": function(key){  delete window[key]; },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; }
 },
 "paddingRight": 0,
 "downloadEnabled": false,
 "borderSize": 0,
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.Button_485BFF41_598E_3DB2_41A9_33F36E014467], 'gyroscopeAvailable'); this.syncPlaylists([this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist,this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist,this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist,this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist,this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist,this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist,this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist,this.mainPlayList]); if(!this.get('fullscreenAvailable')) { [this.Button_4CF1FD24_5A86_3DF2_41B3_7CDBA2E3D44A].forEach(function(component) { component.set('visible', false); }) }",
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "width": "100%",
 "minHeight": 20,
 "borderRadius": 0,
 "overflow": "visible",
 "propagateClick": true,
 "verticalAlign": "top",
 "minWidth": 20,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "desktopMipmappingEnabled": false,
 "height": "100%",
 "definitions": [{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist",
 "class": "PlayList"
},
{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist",
 "class": "PlayList"
},
{
 "buttonCardboardView": "this.Button_4D1C404A_5A87_C3B6_41BC_63B811C40CD0",
 "buttonToggleGyroscope": "this.Button_485BFF41_598E_3DB2_41A9_33F36E014467",
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer",
 "mouseControlMode": "drag_acceleration",
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "displayPlaybackBar": true,
 "buttonToggleHotspots": "this.Button_4DE935B8_5A86_4CD2_41A9_D487E3DF3FBA",
 "gyroscopeVerticalDraggingEnabled": true
},
{
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera",
 "id": "panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 }
},
{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist",
 "class": "PlayList"
},
{
 "hfovMax": 130,
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/f/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/f/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/u/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/u/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/r/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/r/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/b/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/b/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/d/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/d/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/l/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_0/l/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_t.jpg"
  }
 ],
 "label": "Panorama_6",
 "id": "panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
 "thumbnailUrl": "media/panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "hfov": 360,
 "partial": false
},
{
 "hfovMax": 130,
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/f/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/f/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/u/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/u/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/r/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/r/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/b/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/b/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/d/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/d/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/l/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_0/l/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_t.jpg"
  }
 ],
 "label": "Panorama(4)",
 "id": "panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
 "thumbnailUrl": "media/panorama_75441096_65E9_7513_41B7_CE9247FD6D68_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "hfov": 360,
 "partial": false
},
{
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera",
 "id": "panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 }
},
{
 "hfovMax": 130,
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/f/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/f/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/u/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/u/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/r/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/r/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/b/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/b/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/d/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/d/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/l/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_0/l/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_t.jpg"
  }
 ],
 "label": "Panorama hall",
 "id": "panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
 "thumbnailUrl": "media/panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "hfov": 360,
 "partial": false
},
{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera",
 "id": "panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 }
},
{
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera",
 "id": "panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 }
},
{
 "hfovMax": 130,
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/f/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/f/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/u/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/u/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/r/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/r/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/b/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/b/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/d/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/d/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/l/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_0/l/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_t.jpg"
  }
 ],
 "label": "chambre par 1",
 "id": "panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
 "thumbnailUrl": "media/panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "hfov": 360,
 "partial": false
},
{
 "hfovMax": 130,
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/f/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/f/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/u/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/u/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/r/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/r/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/b/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/b/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/d/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/d/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/l/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0/l/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_t.jpg"
  }
 ],
 "label": "Panorama_2",
 "id": "panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
 "thumbnailUrl": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "hfov": 360,
 "overlays": [
  "this.overlay_63332E00_6CFA_A6A5_41D0_01FBC01EB469"
 ],
 "partial": false
},
{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera",
 "id": "panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 }
},
{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "class": "PlayList"
},
{
 "hfovMax": 130,
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/f/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/f/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/f/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/f/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/f/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/u/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/u/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/u/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/u/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/u/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/r/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/r/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/r/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/r/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/r/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "back": {
    "levels": [
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/b/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/b/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/b/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/b/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/b/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/d/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/d/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/d/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/d/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/d/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/l/0/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 5632,
      "colCount": 11,
      "rowCount": 11,
      "height": 5632
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/l/1/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 3072,
      "colCount": 6,
      "rowCount": 6,
      "height": 3072
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/l/2/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1536,
      "colCount": 3,
      "rowCount": 3,
      "height": 1536
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/l/3/{row}_{column}.jpg",
      "tags": "ondemand",
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "rowCount": 2,
      "height": 1024
     },
     {
      "url": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_0/l/4/{row}_{column}.jpg",
      "tags": [
       "ondemand",
       "preload"
      ],
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "rowCount": 1,
      "height": 512
     }
    ],
    "class": "ImageResource"
   },
   "thumbnailUrl": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_t.jpg"
  }
 ],
 "label": "Panorama_1",
 "id": "panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
 "thumbnailUrl": "media/panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_t.jpg",
 "class": "Panorama",
 "pitch": 0,
 "hfov": 360,
 "partial": false
},
{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "yaw": 0,
  "pitch": 0,
  "class": "PanoramaCameraPosition"
 },
 "class": "PanoramaCamera",
 "id": "panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 323,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawSpeed": 7.96,
    "yawDelta": 18.5,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 }
},
{
 "items": [
  {
   "media": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022",
   "camera": "this.panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD",
   "camera": "this.panorama_6EFA4E0C_65E9_8D0D_41BF_96EDC44309FD_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5",
   "camera": "this.panorama_6ECABA25_65E8_953C_41CD_DF23CE70BEC5_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68",
   "camera": "this.panorama_75441096_65E9_7513_41B7_CE9247FD6D68_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461",
   "camera": "this.panorama_6978DB67_6618_8B5C_41D8_C8A194DB4461_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "media": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A",
   "camera": "this.panorama_605D1BDC_6CCB_AD5C_41A3_42962590418A_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist, 5, 0)",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist",
 "class": "PlayList"
},
{
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "left": 0,
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBarBorderRadius": 0,
 "width": "100%",
 "paddingLeft": 0,
 "playbackBarBorderRadius": 0,
 "toolTipShadowOpacity": 0,
 "minHeight": 50,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipFontFamily": "Georgia",
 "progressLeft": 0,
 "propagateClick": true,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "minWidth": 100,
 "playbackBarBorderSize": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipBackgroundColor": "#000000",
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipFontColor": "#FFFFFF",
 "vrPointerSelectionTime": 2000,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "shadow": false,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingRight": 10,
 "paddingRight": 0,
 "progressBarOpacity": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 7,
 "toolTipBorderSize": 1,
 "toolTipDisplayTime": 600,
 "toolTipPaddingLeft": 10,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "top": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBarBorderColor": "#0066FF",
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "transitionDuration": 500,
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 5,
 "progressBorderColor": "#FFFFFF",
 "playbackBarLeft": 0,
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "paddingBottom": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 0.5,
 "toolTipBorderColor": "#767676",
 "class": "ViewerArea",
 "toolTipFontSize": 13,
 "paddingTop": 0,
 "toolTipPaddingBottom": 7,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Main Viewer"
 },
 "toolTipShadowColor": "#333333",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Label_6E5DEFA1_6130_F453_41A9_83DA27ADB1C9",
  "this.Label_6E5D9FA2_6130_F451_41C7_424E5B33B447"
 ],
 "layout": "absolute",
 "id": "Container_6E5D8FA2_6130_F451_41D1_1BF0E97B60CB",
 "left": "1.81%",
 "width": "34.56%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "overflow": "visible",
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "propagateClick": true,
 "verticalAlign": "top",
 "height": "14.536%",
 "minWidth": 1,
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "--STICKER"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Image_05314BAF_3AA1_A6F2_41CB_86A11240FA50",
  "this.Container_0542AAAA_3AA3_A6F3_41B2_0E208ADBBBE1",
  "this.Image_71B7F603_611F_D481_41A2_4812E17C7F88",
  "this.Label_0E9CEE5D_36F3_E64E_419C_5A94FA5D3CA1",
  "this.Label_6ACADF09_65E9_8CEA_419B_6B0FD01592AB"
 ],
 "layout": "absolute",
 "id": "Container_1B9AAD00_16C4_0505_41B5_6F4AE0747E48",
 "left": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "scrollBarColor": "#CC3366",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "visible",
 "height": 60,
 "backgroundColorRatios": [
  0,
  0.07,
  0.2,
  0.31,
  0.32,
  0.42
 ],
 "propagateClick": true,
 "verticalAlign": "top",
 "backgroundColor": [
  "#F0AE31",
  "#F4D149",
  "#FEC938",
  "#FED64D",
  "#F6D84C",
  "#FEF677"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "top": "0%",
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "horizontal",
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "--BUTTON SET"
 }
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Button_4D1C404A_5A87_C3B6_41BC_63B811C40CD0",
  "this.Button_485BFF41_598E_3DB2_41A9_33F36E014467",
  "this.Button_4C5C0864_5A8E_C472_41C4_7C0748488A41",
  "this.Button_4DE935B8_5A86_4CD2_41A9_D487E3DF3FBA",
  "this.Button_4CF1FD24_5A86_3DF2_41B3_7CDBA2E3D44A"
 ],
 "layout": "vertical",
 "id": "Container_0A760F11_3BA1_BFAE_41CD_32268FCAF8B4",
 "width": 60,
 "borderSize": 0,
 "right": 15,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "height": 300,
 "paddingRight": 0,
 "backgroundColorRatios": [
  0.02
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "top": 62,
 "gap": 0,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "-button set"
 }
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_7B212C50_3AA0_A1AF_41C5_F659ED22BD52",
  "this.IconButton_7B21DC51_3AA0_A251_41B1_CEAABC2475F8",
  "this.IconButton_7B21CC51_3AA0_A251_41C9_1ABF5F74EDA0",
  "this.IconButton_7B21FC51_3AA0_A251_41CC_46CDE74591EA",
  "this.IconButton_7B206C51_3AA0_A251_41A3_B3DB657BC52B",
  "this.IconButton_7B201C51_3AA0_A251_41CD_5CC0A59F2DE8",
  "this.IconButton_7B200C51_3AA0_A251_41CC_7E57609B3C93"
 ],
 "layout": "horizontal",
 "id": "Container_1B99BD00_16C4_0505_41A4_A3C2452B0288",
 "left": "0%",
 "width": "100%",
 "paddingRight": 30,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "overflow": "scroll",
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "propagateClick": true,
 "verticalAlign": "middle",
 "height": 90,
 "minWidth": 1,
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 3,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "-button set container"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_062A782F_1140_E20B_41AF_B3E5DE341773",
  "this.Container_062A9830_1140_E215_41A7_5F2BBE5C20E4"
 ],
 "layout": "absolute",
 "id": "Container_062AB830_1140_E215_41AF_6C9D65345420",
 "left": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "top",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "top": "0%",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "---INFO photo"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_39A197B1_0C06_62AF_419A_D15E4DDD2528"
 ],
 "layout": "absolute",
 "id": "Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15",
 "left": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "top",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "top": "0%",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "---PANORAMA LIST"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
  "this.Container_221B3648_0C06_E5FD_4199_FCE031AE003B"
 ],
 "layout": "absolute",
 "id": "Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7",
 "left": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "top",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "top": "0%",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "---LOCATION"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3"
 ],
 "layout": "absolute",
 "id": "Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41",
 "left": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "top",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "top": "0%",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "---FLOORPLAN"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536"
 ],
 "layout": "absolute",
 "id": "Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E",
 "left": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "top",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "top": "0%",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "---PHOTOALBUM"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
  "this.Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F"
 ],
 "layout": "absolute",
 "id": "Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC",
 "left": "0%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 0.6,
 "paddingLeft": 0,
 "scrollBarColor": "#04A3E1",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": true,
 "verticalAlign": "top",
 "backgroundColor": [
  "#000000",
  "#000000"
 ],
 "top": "0%",
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false)",
 "bottom": "0%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "backgroundColorDirection": "vertical",
 "visible": false,
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "---REALTOR"
 }
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Settings Fullscreen"
 },
 "shadowBlurRadius": 6,
 "id": "Button_4CF1FD24_5A86_3DF2_41B3_7CDBA2E3D44A",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "width": 60,
 "layout": "horizontal",
 "fontFamily": "Arial",
 "pressedIconHeight": 30,
 "shadowColor": "#000000",
 "borderSize": 0,
 "pressedIconWidth": 30,
 "paddingRight": 0,
 "iconHeight": 30,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "borderColor": "#000000",
 "pressedRollOverBackgroundColorRatios": [
  0
 ],
 "height": 60,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "mode": "toggle",
 "pressedIconURL": "skin/Button_4CF1FD24_5A86_3DF2_41B3_7CDBA2E3D44A_pressed.png",
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "iconURL": "skin/Button_4CF1FD24_5A86_3DF2_41B3_7CDBA2E3D44A.png",
 "class": "Button",
 "iconWidth": 30,
 "backgroundColorDirection": "vertical",
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "rollOverBackgroundOpacity": 1,
 "shadow": false,
 "pressedRollOverBackgroundColor": [
  "#CE6700"
 ]
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Settings Mute"
 },
 "shadowBlurRadius": 6,
 "id": "Button_4C5C0864_5A8E_C472_41C4_7C0748488A41",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "width": 60,
 "layout": "horizontal",
 "fontFamily": "Arial",
 "pressedIconHeight": 30,
 "shadowColor": "#000000",
 "borderSize": 0,
 "pressedIconWidth": 30,
 "paddingRight": 0,
 "iconHeight": 30,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "borderColor": "#000000",
 "pressedRollOverBackgroundColorRatios": [
  0
 ],
 "height": 60,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "mode": "toggle",
 "pressedIconURL": "skin/Button_4C5C0864_5A8E_C472_41C4_7C0748488A41_pressed.png",
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "iconURL": "skin/Button_4C5C0864_5A8E_C472_41C4_7C0748488A41.png",
 "class": "Button",
 "iconWidth": 30,
 "backgroundColorDirection": "vertical",
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "rollOverBackgroundOpacity": 1,
 "shadow": false,
 "pressedRollOverBackgroundColor": [
  "#CE6700"
 ]
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "shadowBlurRadius": 6,
 "id": "Button_4D1C404A_5A87_C3B6_41BC_63B811C40CD0",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "width": 60,
 "layout": "horizontal",
 "fontFamily": "Arial",
 "shadowColor": "#000000",
 "borderSize": 0,
 "paddingRight": 0,
 "iconHeight": 30,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "borderColor": "#000000",
 "height": 60,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "mode": "push",
 "pressedIconURL": "skin/Button_4D1C404A_5A87_C3B6_41BC_63B811C40CD0_pressed.png",
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "iconURL": "skin/Button_4D1C404A_5A87_C3B6_41BC_63B811C40CD0.png",
 "class": "Button",
 "iconWidth": 30,
 "backgroundColorDirection": "vertical",
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "rollOverBackgroundOpacity": 1,
 "shadow": false,
 "data": {
  "name": "Button settings VR"
 }
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Settings Gyro"
 },
 "rollOverIconHeight": 30,
 "shadowBlurRadius": 6,
 "id": "Button_485BFF41_598E_3DB2_41A9_33F36E014467",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "width": 60,
 "layout": "horizontal",
 "fontFamily": "Arial",
 "pressedIconHeight": 30,
 "shadowColor": "#000000",
 "borderSize": 0,
 "pressedIconWidth": 30,
 "paddingRight": 0,
 "iconHeight": 30,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "borderColor": "#000000",
 "pressedRollOverBackgroundColorRatios": [
  0
 ],
 "height": 60,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "mode": "toggle",
 "rollOverIconWidth": 30,
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": 12,
 "paddingBottom": 0,
 "pressedIconURL": "skin/Button_485BFF41_598E_3DB2_41A9_33F36E014467_pressed.png",
 "fontStyle": "normal",
 "paddingTop": 0,
 "iconURL": "skin/Button_485BFF41_598E_3DB2_41A9_33F36E014467.png",
 "class": "Button",
 "iconWidth": 30,
 "backgroundColorDirection": "vertical",
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "rollOverBackgroundOpacity": 1,
 "shadow": false,
 "pressedRollOverBackgroundColor": [
  "#CE6700"
 ]
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "Button Settings HS"
 },
 "rollOverIconHeight": 30,
 "shadowBlurRadius": 6,
 "id": "Button_4DE935B8_5A86_4CD2_41A9_D487E3DF3FBA",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "width": 60,
 "layout": "horizontal",
 "fontFamily": "Arial",
 "pressedIconHeight": 30,
 "shadowColor": "#000000",
 "borderSize": 0,
 "pressedIconWidth": 30,
 "paddingRight": 0,
 "iconHeight": 30,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "borderColor": "#000000",
 "pressedRollOverBackgroundColorRatios": [
  0
 ],
 "height": 60,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "mode": "toggle",
 "rollOverIconWidth": 30,
 "pressedIconURL": "skin/Button_4DE935B8_5A86_4CD2_41A9_D487E3DF3FBA_pressed.png",
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "iconURL": "skin/Button_4DE935B8_5A86_4CD2_41A9_D487E3DF3FBA.png",
 "class": "Button",
 "iconWidth": 30,
 "backgroundColorDirection": "vertical",
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "rollOverBackgroundOpacity": 1,
 "shadow": false,
 "pressedRollOverBackgroundColor": [
  "#CE6700"
 ]
},
{
 "enabledInCardboard": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "click": "this.openLink('http://www.samsung.com/us/tvs/', '_blank')",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Image"
 },
 "maps": [
  {
   "hfov": 7.52,
   "yaw": -30.76,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0_HS_0_0_0_map.gif",
      "width": 16,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.72,
   "class": "HotspotPanoramaOverlayMap"
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.52,
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_6E31FBD1_65E9_8B17_41D7_1258F5F9D022_0_HS_0_0.png",
      "width": 344,
      "height": 343,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "yaw": -30.76,
   "pitch": -5.72
  }
 ],
 "id": "overlay_63332E00_6CFA_A6A5_41D0_01FBC01EB469",
 "rollOverDisplay": false
},
{
 "fontFamily": "Bebas Neue Bold",
 "fontColor": "#FFFFFF",
 "id": "Label_6E5DEFA1_6130_F453_41A9_83DA27ADB1C9",
 "left": 0,
 "textShadowBlurRadius": 10,
 "width": 454,
 "textShadowHorizontalLength": 0,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "textShadowColor": "#000000",
 "text": "mirage",
 "minHeight": 1,
 "borderRadius": 0,
 "propagateClick": true,
 "verticalAlign": "top",
 "height": 86,
 "top": 5,
 "minWidth": 1,
 "textShadowOpacity": 1,
 "textShadowVerticalLength": 0,
 "fontSize": 90,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "class": "Label",
 "textDecoration": "none",
 "fontWeight": "bold",
 "horizontalAlign": "left",
 "shadow": false,
 "data": {
  "name": "text 1"
 }
},
{
 "fontFamily": "Bebas Neue Book",
 "fontColor": "#FFFFFF",
 "id": "Label_6E5D9FA2_6130_F451_41C7_424E5B33B447",
 "left": 0,
 "textShadowBlurRadius": 10,
 "width": 388,
 "textShadowHorizontalLength": 0,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "textShadowColor": "#000000",
 "text": "landermark ",
 "minHeight": 1,
 "borderRadius": 0,
 "propagateClick": true,
 "verticalAlign": "top",
 "height": 46,
 "minWidth": 1,
 "bottom": 0,
 "textShadowOpacity": 1,
 "textShadowVerticalLength": 0,
 "fontSize": 41,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "class": "Label",
 "textDecoration": "none",
 "fontWeight": "normal",
 "horizontalAlign": "left",
 "shadow": false,
 "data": {
  "name": "text 2"
 }
},
{
 "maxWidth": 40,
 "id": "Image_05314BAF_3AA1_A6F2_41CB_86A11240FA50",
 "left": "1.81%",
 "maxHeight": 30,
 "width": "2.413%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "url": "skin/Image_05314BAF_3AA1_A6F2_41CB_86A11240FA50.png",
 "minHeight": 1,
 "borderRadius": 0,
 "top": "0%",
 "propagateClick": false,
 "verticalAlign": "middle",
 "minWidth": 1,
 "bottom": "50%",
 "paddingBottom": 0,
 "paddingTop": 0,
 "class": "Image",
 "scaleMode": "fit_inside",
 "horizontalAlign": "center",
 "shadow": false,
 "data": {
  "name": "logo"
 }
},
{
 "horizontalAlign": "right",
 "children": [
  "this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29",
  "this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312",
  "this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B",
  "this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7",
  "this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09",
  "this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE",
  "this.Button_4CC5476E_5ABB_CC4E_41D1_A04ABE17DA89"
 ],
 "layout": "horizontal",
 "id": "Container_0542AAAA_3AA3_A6F3_41B2_0E208ADBBBE1",
 "width": 1199,
 "paddingRight": 15,
 "borderSize": 0,
 "right": "0%",
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "scrollBarVisible": "rollOver",
 "propagateClick": true,
 "verticalAlign": "middle",
 "height": 60,
 "top": "0%",
 "minWidth": 1,
 "scrollBarOpacity": 0.5,
 "gap": 3,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "-button set container"
 }
},
{
 "maxWidth": 834,
 "id": "Image_71B7F603_611F_D481_41A2_4812E17C7F88",
 "left": "1.55%",
 "maxHeight": 837,
 "width": "3.8%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "url": "skin/Image_71B7F603_611F_D481_41A2_4812E17C7F88.jpg",
 "minHeight": 1,
 "borderRadius": 0,
 "top": "0%",
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": "100%",
 "minWidth": 1,
 "paddingBottom": 0,
 "paddingTop": 0,
 "class": "Image",
 "scaleMode": "fit_inside",
 "horizontalAlign": "center",
 "shadow": false,
 "data": {
  "name": "Image5600"
 }
},
{
 "fontFamily": "Algerian",
 "fontColor": "#282828",
 "id": "Label_0E9CEE5D_36F3_E64E_419C_5A94FA5D3CA1",
 "left": "6.15%",
 "width": 238,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "text": "ALRRAID.PRO",
 "minHeight": 1,
 "borderRadius": 0,
 "top": "0%",
 "propagateClick": true,
 "verticalAlign": "middle",
 "minWidth": 1,
 "bottom": "0%",
 "fontSize": "2.11vw",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "class": "Label",
 "textDecoration": "none",
 "visible": false,
 "fontWeight": "bold",
 "horizontalAlign": "left",
 "shadow": false,
 "data": {
  "name": "Label Company Name"
 }
},
{
 "fontFamily": "Arial",
 "fontColor": "#000000",
 "id": "Label_6ACADF09_65E9_8CEA_419B_6B0FD01592AB",
 "left": "0%",
 "width": "16.104%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "text": "Label",
 "minHeight": 1,
 "borderRadius": 0,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": "95%",
 "minWidth": 1,
 "bottom": "0%",
 "fontSize": "1.48vmin",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "class": "Label",
 "textDecoration": "none",
 "fontWeight": "normal",
 "horizontalAlign": "center",
 "shadow": false,
 "data": {
  "name": "Label3408"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 101,
 "id": "IconButton_7B212C50_3AA0_A1AF_41C5_F659ED22BD52",
 "maxHeight": 101,
 "width": 44,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "borderRadius": 0,
 "transparencyActive": true,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": 44,
 "rollOverIconURL": "skin/IconButton_7B212C50_3AA0_A1AF_41C5_F659ED22BD52_rollover.png",
 "minWidth": 1,
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, true, 0, null, null, false)",
 "mode": "push",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconURL": "skin/IconButton_7B212C50_3AA0_A1AF_41C5_F659ED22BD52.png",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton Info"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 101,
 "id": "IconButton_7B21DC51_3AA0_A251_41B1_CEAABC2475F8",
 "maxHeight": 101,
 "width": 44,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "borderRadius": 0,
 "transparencyActive": true,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": 44,
 "rollOverIconURL": "skin/IconButton_7B21DC51_3AA0_A251_41B1_CEAABC2475F8_rollover.png",
 "minWidth": 1,
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, true, 0, null, null, false)",
 "mode": "push",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconURL": "skin/IconButton_7B21DC51_3AA0_A251_41B1_CEAABC2475F8.png",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton Thumblist"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 101,
 "id": "IconButton_7B21CC51_3AA0_A251_41C9_1ABF5F74EDA0",
 "maxHeight": 101,
 "width": 44,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "borderRadius": 0,
 "transparencyActive": true,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": 44,
 "rollOverIconURL": "skin/IconButton_7B21CC51_3AA0_A251_41C9_1ABF5F74EDA0_rollover.png",
 "minWidth": 1,
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, true, 0, null, null, false)",
 "mode": "push",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconURL": "skin/IconButton_7B21CC51_3AA0_A251_41C9_1ABF5F74EDA0.png",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton Location"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 101,
 "id": "IconButton_7B21FC51_3AA0_A251_41CC_46CDE74591EA",
 "maxHeight": 101,
 "width": 44,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "borderRadius": 0,
 "transparencyActive": true,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": 44,
 "rollOverIconURL": "skin/IconButton_7B21FC51_3AA0_A251_41CC_46CDE74591EA_rollover.png",
 "minWidth": 1,
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, true, 0, null, null, false)",
 "mode": "push",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconURL": "skin/IconButton_7B21FC51_3AA0_A251_41CC_46CDE74591EA.png",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton Photoalbum"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 101,
 "id": "IconButton_7B206C51_3AA0_A251_41A3_B3DB657BC52B",
 "maxHeight": 101,
 "width": 44,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "borderRadius": 0,
 "transparencyActive": true,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": 44,
 "rollOverIconURL": "skin/IconButton_7B206C51_3AA0_A251_41A3_B3DB657BC52B_rollover.png",
 "minWidth": 1,
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, true, 0, null, null, false)",
 "mode": "push",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconURL": "skin/IconButton_7B206C51_3AA0_A251_41A3_B3DB657BC52B.png",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton Floorplan"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 101,
 "id": "IconButton_7B201C51_3AA0_A251_41CD_5CC0A59F2DE8",
 "maxHeight": 101,
 "width": 44,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "borderRadius": 0,
 "transparencyActive": true,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": 44,
 "rollOverIconURL": "skin/IconButton_7B201C51_3AA0_A251_41CD_5CC0A59F2DE8_rollover.png",
 "minWidth": 1,
 "pressedIconURL": "skin/IconButton_7B201C51_3AA0_A251_41CD_5CC0A59F2DE8_pressed.png",
 "mode": "push",
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, true, 0, null, null, false)",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconURL": "skin/IconButton_7B201C51_3AA0_A251_41CD_5CC0A59F2DE8.png",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton Realtor"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 101,
 "id": "IconButton_7B200C51_3AA0_A251_41CC_7E57609B3C93",
 "maxHeight": 101,
 "width": 44,
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 1,
 "borderRadius": 0,
 "transparencyActive": true,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": 44,
 "rollOverIconURL": "skin/IconButton_7B200C51_3AA0_A251_41CC_7E57609B3C93_rollover.png",
 "minWidth": 1,
 "mode": "push",
 "paddingBottom": 0,
 "paddingTop": 0,
 "iconURL": "skin/IconButton_7B200C51_3AA0_A251_41CC_7E57609B3C93.png",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton Video"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
  "this.Container_26D3A42C_3F86_BA30_419B_2C6BE84D2718",
  "this.Container_062A082F_1140_E20A_4193_DF1A4391DC79"
 ],
 "shadowBlurRadius": 25,
 "id": "Container_062A782F_1140_E20B_41AF_B3E5DE341773",
 "left": "15%",
 "layout": "horizontal",
 "shadowColor": "#000000",
 "right": "15%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "shadowVerticalLength": 0,
 "shadowSpread": 1,
 "shadowOpacity": 0.3,
 "minHeight": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "bottom": "10%",
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 0,
 "gap": 0,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": true,
 "contentOpaque": false,
 "data": {
  "name": "Global"
 }
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_062A8830_1140_E215_419D_3439F16CCB3E"
 ],
 "layout": "vertical",
 "id": "Container_062A9830_1140_E215_41A7_5F2BBE5C20E4",
 "left": "15%",
 "paddingRight": 20,
 "borderSize": 0,
 "right": "15%",
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "visible",
 "top": "10%",
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "verticalAlign": "top",
 "minWidth": 1,
 "bottom": "80%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 20,
 "scrollBarWidth": 10,
 "class": "Container",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container X global"
 }
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
  "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0"
 ],
 "shadowBlurRadius": 25,
 "id": "Container_39A197B1_0C06_62AF_419A_D15E4DDD2528",
 "left": "15%",
 "layout": "absolute",
 "shadowColor": "#000000",
 "right": "15%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "shadowVerticalLength": 0,
 "shadowSpread": 1,
 "shadowOpacity": 0.3,
 "minHeight": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "overflow": "visible",
 "scrollBarColor": "#000000",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "bottom": "10%",
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 0,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": true,
 "contentOpaque": false,
 "data": {
  "name": "Global"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA"
 ],
 "shadowBlurRadius": 25,
 "id": "Container_221C1648_0C06_E5FD_4180_8A2E8B66315E",
 "left": "15%",
 "layout": "horizontal",
 "shadowColor": "#000000",
 "right": "15%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "shadowVerticalLength": 0,
 "shadowSpread": 1,
 "shadowOpacity": 0.3,
 "minHeight": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "bottom": "10%",
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 0,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": true,
 "contentOpaque": false,
 "data": {
  "name": "Global"
 }
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF"
 ],
 "layout": "vertical",
 "id": "Container_221B3648_0C06_E5FD_4199_FCE031AE003B",
 "left": "15%",
 "paddingRight": 20,
 "borderSize": 0,
 "right": "15%",
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "visible",
 "top": "10%",
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "verticalAlign": "top",
 "minWidth": 1,
 "bottom": "80%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 20,
 "scrollBarWidth": 10,
 "class": "Container",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container X global"
 }
},
{
 "horizontalAlign": "center",
 "children": [
  "this.MapViewer",
  "this.Container_2F8A7686_0D4F_6B71_41A9_1A894413085C"
 ],
 "shadowBlurRadius": 25,
 "id": "Container_2F8A6686_0D4F_6B71_4174_A02FE43588D3",
 "left": "15%",
 "layout": "absolute",
 "shadowColor": "#000000",
 "right": "15%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "shadowVerticalLength": 0,
 "shadowSpread": 1,
 "shadowOpacity": 0.3,
 "minHeight": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "overflow": "visible",
 "scrollBarColor": "#000000",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "bottom": "10%",
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 0,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": true,
 "contentOpaque": false,
 "data": {
  "name": "Global"
 }
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC"
 ],
 "shadowBlurRadius": 25,
 "id": "Container_2A193C4C_0D3B_DFF0_4161_A2CD128EF536",
 "left": "15%",
 "layout": "vertical",
 "shadowColor": "#000000",
 "right": "15%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "shadowVerticalLength": 0,
 "shadowSpread": 1,
 "shadowOpacity": 0.3,
 "minHeight": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "overflow": "visible",
 "scrollBarColor": "#000000",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "bottom": "10%",
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 0,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": true,
 "contentOpaque": false,
 "data": {
  "name": "Global"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
  "this.Container_27875147_3F82_7A70_41CC_C0FFBB32BEFD",
  "this.Container_06C58BA5_1140_A63F_419D_EC83F94F8C54"
 ],
 "shadowBlurRadius": 25,
 "id": "Container_06C5DBA5_1140_A63F_41AD_1D83A33F1255",
 "left": "15%",
 "layout": "horizontal",
 "shadowColor": "#000000",
 "right": "15%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 1,
 "paddingLeft": 0,
 "shadowVerticalLength": 0,
 "shadowSpread": 1,
 "shadowOpacity": 0.3,
 "minHeight": 1,
 "creationPolicy": "inAdvance",
 "borderRadius": 0,
 "overflow": "scroll",
 "scrollBarColor": "#000000",
 "top": "10%",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "bottom": "10%",
 "scrollBarOpacity": 0.5,
 "shadowHorizontalLength": 0,
 "gap": 0,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": true,
 "contentOpaque": false,
 "data": {
  "name": "Global"
 }
},
{
 "horizontalAlign": "right",
 "children": [
  "this.IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81"
 ],
 "layout": "vertical",
 "id": "Container_06C43BA5_1140_A63F_41A1_96DC8F4CAD2F",
 "left": "15%",
 "paddingRight": 20,
 "borderSize": 0,
 "right": "15%",
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "visible",
 "top": "10%",
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "verticalAlign": "top",
 "minWidth": 1,
 "bottom": "80%",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 20,
 "scrollBarWidth": 10,
 "class": "Container",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container X global"
 }
},
{
 "fontFamily": "Montserrat",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "DropDown 1"
 },
 "popUpPaddingLeft": 15,
 "popUpShadowSpread": 1,
 "id": "DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29",
 "pressedBackgroundColor": [
  "#CE6700"
 ],
 "width": 116,
 "arrowBeforeLabel": false,
 "rollOverPopUpBackgroundColor": "#CE6700",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "borderSize": 0,
 "paddingRight": 15,
 "paddingLeft": 15,
 "playList": "this.DropDown_0561BA16_3AA3_A1D2_41C7_FDA0B6E9EE29_playlist",
 "popUpShadowColor": "#000000",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "popUpGap": 2,
 "popUpBackgroundColor": "#F7931E",
 "height": 60,
 "pressedBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "selectedPopUpBackgroundColor": "#CE6700",
 "propagateClick": false,
 "backgroundColor": [
  "#0D172B"
 ],
 "minWidth": 1,
 "popUpBackgroundOpacity": 1,
 "label": "RECEPTION",
 "popUpPaddingBottom": 10,
 "popUpShadow": false,
 "gap": 0,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "popUpFontColor": "#FFFFFF",
 "class": "DropDown",
 "arrowColor": "#FFFFFF",
 "popUpPaddingTop": 10,
 "backgroundColorDirection": "vertical",
 "fontWeight": "bold",
 "textDecoration": "none",
 "popUpShadowBlurRadius": 6,
 "popUpBorderRadius": 0,
 "shadow": false,
 "popUpShadowOpacity": 0
},
{
 "fontFamily": "Montserrat",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "DropDown 2"
 },
 "popUpPaddingLeft": 15,
 "popUpShadowSpread": 1,
 "id": "DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312",
 "pressedBackgroundColor": [
  "#CE6700"
 ],
 "width": 96,
 "arrowBeforeLabel": false,
 "rollOverPopUpBackgroundColor": "#CE6700",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "borderSize": 0,
 "paddingRight": 15,
 "paddingLeft": 15,
 "playList": "this.DropDown_05789A1B_3AA3_A1D2_41CC_002739F0C312_playlist",
 "popUpShadowColor": "#000000",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "popUpGap": 2,
 "popUpBackgroundColor": "#F7931E",
 "pressedBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "selectedPopUpBackgroundColor": "#CE6700",
 "propagateClick": false,
 "backgroundColor": [
  "#0D172B"
 ],
 "minWidth": 1,
 "popUpBackgroundOpacity": 1,
 "label": "ROOMS",
 "popUpPaddingBottom": 10,
 "height": "100%",
 "popUpShadow": false,
 "gap": 0,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "popUpFontColor": "#FFFFFF",
 "class": "DropDown",
 "arrowColor": "#FFFFFF",
 "popUpPaddingTop": 10,
 "backgroundColorDirection": "vertical",
 "fontWeight": "bold",
 "textDecoration": "none",
 "popUpShadowBlurRadius": 6,
 "popUpBorderRadius": 5,
 "shadow": false,
 "popUpShadowOpacity": 0
},
{
 "fontFamily": "Montserrat",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "DropDown 3"
 },
 "popUpPaddingLeft": 15,
 "popUpShadowSpread": 1,
 "id": "DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B",
 "pressedBackgroundColor": [
  "#CE6700"
 ],
 "width": 114,
 "arrowBeforeLabel": false,
 "rollOverPopUpBackgroundColor": "#CE6700",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "borderSize": 0,
 "paddingRight": 15,
 "paddingLeft": 15,
 "playList": "this.DropDown_05783A1F_3AA3_A1D2_41A6_E88282E5373B_playlist",
 "popUpShadowColor": "#000000",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "popUpGap": 2,
 "popUpBackgroundColor": "#F7931E",
 "height": 60,
 "pressedBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "selectedPopUpBackgroundColor": "#CE6700",
 "propagateClick": false,
 "backgroundColor": [
  "#0D172B"
 ],
 "minWidth": 1,
 "popUpBackgroundOpacity": 1,
 "label": "AMENITIES",
 "popUpPaddingBottom": 10,
 "popUpShadow": false,
 "gap": 0,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "popUpFontColor": "#FFFFFF",
 "class": "DropDown",
 "arrowColor": "#FFFFFF",
 "popUpPaddingTop": 10,
 "backgroundColorDirection": "vertical",
 "fontWeight": "bold",
 "textDecoration": "none",
 "popUpShadowBlurRadius": 6,
 "popUpBorderRadius": 0,
 "shadow": false,
 "popUpShadowOpacity": 0
},
{
 "fontFamily": "Montserrat",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "DropDown 4"
 },
 "popUpPaddingLeft": 15,
 "popUpShadowSpread": 1,
 "id": "DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7",
 "pressedBackgroundColor": [
  "#CE6700"
 ],
 "width": 130,
 "arrowBeforeLabel": false,
 "rollOverPopUpBackgroundColor": "#CE6700",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "borderSize": 0,
 "paddingRight": 15,
 "paddingLeft": 15,
 "playList": "this.DropDown_057BFA20_3AA3_A1EE_41A9_8EE569D894A7_playlist",
 "popUpShadowColor": "#000000",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "popUpGap": 2,
 "popUpBackgroundColor": "#F7931E",
 "height": 60,
 "pressedBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "selectedPopUpBackgroundColor": "#CE6700",
 "propagateClick": false,
 "backgroundColor": [
  "#0D172B"
 ],
 "minWidth": 1,
 "popUpBackgroundOpacity": 1,
 "label": "SPORTS AREA",
 "popUpPaddingBottom": 10,
 "popUpShadow": false,
 "gap": 0,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "popUpFontColor": "#FFFFFF",
 "class": "DropDown",
 "arrowColor": "#FFFFFF",
 "popUpPaddingTop": 10,
 "backgroundColorDirection": "vertical",
 "fontWeight": "bold",
 "textDecoration": "none",
 "popUpShadowBlurRadius": 6,
 "popUpBorderRadius": 0,
 "shadow": false,
 "popUpShadowOpacity": 0
},
{
 "fontFamily": "Montserrat",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "DropDown 5"
 },
 "popUpPaddingLeft": 15,
 "popUpShadowSpread": 1,
 "id": "DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09",
 "pressedBackgroundColor": [
  "#CE6700"
 ],
 "width": 152,
 "arrowBeforeLabel": false,
 "rollOverPopUpBackgroundColor": "#CE6700",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "borderSize": 0,
 "paddingRight": 15,
 "paddingLeft": 15,
 "playList": "this.DropDown_057B3A27_3AA3_A1F2_41C0_6BB995D79A09_playlist",
 "popUpShadowColor": "#000000",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "popUpGap": 2,
 "popUpBackgroundColor": "#F7931E",
 "height": 60,
 "pressedBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorRatios": [
  0.01
 ],
 "backgroundColorRatios": [
  0
 ],
 "selectedPopUpBackgroundColor": "#CE6700",
 "propagateClick": false,
 "backgroundColor": [
  "#0D172B"
 ],
 "minWidth": 1,
 "popUpBackgroundOpacity": 1,
 "label": "SWIMMING POOL",
 "popUpPaddingBottom": 10,
 "popUpShadow": false,
 "gap": 0,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "popUpFontColor": "#FFFFFF",
 "class": "DropDown",
 "arrowColor": "#FFFFFF",
 "popUpPaddingTop": 10,
 "backgroundColorDirection": "vertical",
 "fontWeight": "bold",
 "textDecoration": "none",
 "popUpShadowBlurRadius": 6,
 "popUpBorderRadius": 0,
 "shadow": false,
 "popUpShadowOpacity": 0
},
{
 "fontFamily": "Montserrat",
 "fontColor": "#FFFFFF",
 "data": {
  "name": "DropDown 6"
 },
 "popUpPaddingLeft": 15,
 "popUpShadowSpread": 1,
 "id": "DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE",
 "pressedBackgroundColor": [
  "#CE6700"
 ],
 "width": 136,
 "arrowBeforeLabel": false,
 "rollOverPopUpBackgroundColor": "#CE6700",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "borderSize": 0,
 "paddingRight": 15,
 "paddingLeft": 15,
 "playList": "this.DropDown_05784A29_3AA3_A1FE_41B1_E2305F2F53BE_playlist",
 "popUpShadowColor": "#000000",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "popUpGap": 2,
 "popUpBackgroundColor": "#F7931E",
 "height": 60,
 "pressedBackgroundColorRatios": [
  0
 ],
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "selectedPopUpBackgroundColor": "#CE6700",
 "propagateClick": false,
 "backgroundColor": [
  "#0D172B"
 ],
 "minWidth": 1,
 "popUpBackgroundOpacity": 1,
 "label": "RESTAURANTS",
 "popUpPaddingBottom": 10,
 "popUpShadow": false,
 "gap": 0,
 "fontSize": 12,
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "popUpFontColor": "#FFFFFF",
 "class": "DropDown",
 "arrowColor": "#FFFFFF",
 "popUpPaddingTop": 10,
 "backgroundColorDirection": "vertical",
 "fontWeight": "bold",
 "textDecoration": "none",
 "popUpShadowBlurRadius": 6,
 "popUpBorderRadius": 0,
 "shadow": false,
 "popUpShadowOpacity": 0
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "shadowBlurRadius": 6,
 "id": "Button_4CC5476E_5ABB_CC4E_41D1_A04ABE17DA89",
 "rollOverBackgroundColor": [
  "#CE6700"
 ],
 "width": 60,
 "layout": "horizontal",
 "fontFamily": "Arial",
 "shadowColor": "#000000",
 "borderSize": 0,
 "paddingRight": 0,
 "iconHeight": 17,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "borderColor": "#000000",
 "height": 60,
 "rollOverBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#0D172B"
 ],
 "minWidth": 1,
 "mode": "toggle",
 "pressedIconURL": "skin/Button_4CC5476E_5ABB_CC4E_41D1_A04ABE17DA89_pressed.png",
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": 12,
 "paddingBottom": 0,
 "click": "if(!this.Container_0A760F11_3BA1_BFAE_41CD_32268FCAF8B4.get('visible')){ this.setComponentVisibility(this.Container_0A760F11_3BA1_BFAE_41CD_32268FCAF8B4, true, 0, null, null, false) } else { this.setComponentVisibility(this.Container_0A760F11_3BA1_BFAE_41CD_32268FCAF8B4, false, 0, null, null, false) }",
 "fontStyle": "normal",
 "paddingTop": 0,
 "iconURL": "skin/Button_4CC5476E_5ABB_CC4E_41D1_A04ABE17DA89.png",
 "class": "Button",
 "iconWidth": 17,
 "backgroundColorDirection": "vertical",
 "fontWeight": "normal",
 "textDecoration": "none",
 "cursor": "hand",
 "rollOverBackgroundOpacity": 1,
 "shadow": false,
 "data": {
  "name": "Button Settings"
 }
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A"
 ],
 "layout": "absolute",
 "id": "Container_062A682F_1140_E20B_41B0_3071FCBF3DC9",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 1,
 "width": "85%",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#000000"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "height": "100%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "-left"
 }
},
{
 "horizontalAlign": "left",
 "layout": "absolute",
 "id": "Container_26D3A42C_3F86_BA30_419B_2C6BE84D2718",
 "width": 8,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "height": "100%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "orange line"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_062A3830_1140_E215_4195_1698933FE51C",
  "this.Container_062A2830_1140_E215_41AA_EB25B7BD381C",
  "this.Container_062AE830_1140_E215_4180_196ED689F4BD"
 ],
 "layout": "vertical",
 "id": "Container_062A082F_1140_E20A_4193_DF1A4391DC79",
 "paddingRight": 50,
 "borderSize": 0,
 "paddingLeft": 50,
 "scrollBarColor": "#0069A3",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 1,
 "width": "50%",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "visible",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 460,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.51,
 "height": "100%",
 "gap": 0,
 "scrollBarMargin": 2,
 "paddingBottom": 20,
 "paddingTop": 20,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "-right"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 60,
 "id": "IconButton_062A8830_1140_E215_419D_3439F16CCB3E",
 "maxHeight": 60,
 "width": "25%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": "75%",
 "rollOverIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_rollover.jpg",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E_pressed.jpg",
 "mode": "push",
 "click": "this.setComponentVisibility(this.Container_062AB830_1140_E215_41AF_6C9D65345420, false, 0, null, null, false)",
 "paddingBottom": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_062A8830_1140_E215_419D_3439F16CCB3E.jpg",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "X"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_38922473_0C06_2593_4199_C585853A1AB3"
 ],
 "layout": "absolute",
 "id": "Container_3A67552A_0C3A_67BD_4195_ECE46CCB34EA",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "height": 140,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "header"
 }
},
{
 "horizontalAlign": "center",
 "itemMaxHeight": 1000,
 "itemMaxWidth": 1000,
 "rollOverItemThumbnailShadowColor": "#F7931E",
 "left": 0,
 "itemHorizontalAlign": "center",
 "itemLabelFontFamily": "Montserrat",
 "data": {
  "name": "ThumbnailList"
 },
 "id": "ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0",
 "itemThumbnailOpacity": 1,
 "width": "100%",
 "itemWidth": 220,
 "selectedItemThumbnailShadow": true,
 "itemBorderRadius": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 70,
 "selectedItemThumbnailShadowBlurRadius": 16,
 "itemLabelGap": 7,
 "rollOverItemThumbnailShadowHorizontalLength": 8,
 "minHeight": 1,
 "itemThumbnailBorderRadius": 0,
 "verticalAlign": "middle",
 "itemLabelPosition": "bottom",
 "height": "92%",
 "itemMinHeight": 50,
 "propagateClick": false,
 "itemPaddingLeft": 3,
 "minWidth": 1,
 "itemPaddingRight": 3,
 "selectedItemLabelFontColor": "#F7931E",
 "scrollBarMargin": 2,
 "itemBackgroundColor": [],
 "scrollBarWidth": 10,
 "itemVerticalAlign": "top",
 "itemBackgroundColorRatios": [],
 "itemPaddingTop": 3,
 "itemMinWidth": 50,
 "shadow": false,
 "selectedItemLabelFontWeight": "bold",
 "itemThumbnailShadow": false,
 "rollOverItemThumbnailShadowBlurRadius": 0,
 "itemLabelTextDecoration": "none",
 "itemHeight": 160,
 "selectedItemThumbnailShadowHorizontalLength": 0,
 "paddingRight": 70,
 "itemLabelFontWeight": "normal",
 "borderSize": 0,
 "playList": "this.ThumbnailList_034EDD7A_0D3B_3991_41A5_D706671923C0_playlist",
 "scrollBarColor": "#F7931E",
 "itemLabelFontSize": 13,
 "rollOverItemThumbnailShadow": true,
 "itemThumbnailScaleMode": "fit_outside",
 "borderRadius": 5,
 "itemThumbnailHeight": 125,
 "scrollBarOpacity": 0.5,
 "rollOverItemLabelFontColor": "#F7931E",
 "scrollBarVisible": "rollOver",
 "bottom": -0.2,
 "itemBackgroundColorDirection": "vertical",
 "itemLabelFontColor": "#666666",
 "rollOverItemThumbnailShadowVerticalLength": 0,
 "gap": 26,
 "paddingBottom": 70,
 "paddingTop": 10,
 "itemThumbnailWidth": 220,
 "itemPaddingBottom": 3,
 "class": "ThumbnailGrid",
 "itemBackgroundOpacity": 0,
 "itemLabelHorizontalAlign": "center",
 "itemOpacity": 1,
 "itemMode": "normal",
 "itemLabelFontStyle": "normal",
 "selectedItemThumbnailShadowVerticalLength": 0
},
{
 "scrollEnabled": true,
 "id": "WebFrame_22F9EEFF_0C1A_2293_4165_411D4444EFEA",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "backgroundOpacity": 1,
 "width": "100%",
 "minHeight": 1,
 "borderRadius": 0,
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "backgroundColor": [
  "#FFFFFF"
 ],
 "url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14377.55330038866!2d-73.99492968084243!3d40.75084469078082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9f775f259%3A0x999668d0d7c3fd7d!2s400+5th+Ave%2C+New+York%2C+NY+10018!5e0!3m2!1ses!2sus!4v1467271743182\" width=\"600\" height=\"450\" frameborder=\"0\" style=\"border:0\" allowfullscreen>",
 "minWidth": 1,
 "height": "100%",
 "paddingBottom": 0,
 "paddingTop": 0,
 "insetBorder": false,
 "class": "WebFrame",
 "backgroundColorDirection": "vertical",
 "shadow": false,
 "data": {
  "name": "WebFrame48191"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 60,
 "id": "IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF",
 "maxHeight": 60,
 "width": "25%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": "75%",
 "rollOverIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_rollover.jpg",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF_pressed.jpg",
 "mode": "push",
 "click": "this.setComponentVisibility(this.Container_221B1648_0C06_E5FD_417F_E6FCCCB4A6D7, false, 0, null, null, false)",
 "paddingBottom": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_221B2648_0C06_E5FD_41A6_F9E27CDB95AF.jpg",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "X"
 }
},
{
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "id": "MapViewer",
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBarBorderRadius": 0,
 "width": "100%",
 "paddingLeft": 0,
 "playbackBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "minHeight": 1,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipFontFamily": "Arial",
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "minWidth": 1,
 "playbackBarBorderSize": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "progressRight": 0,
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipFontColor": "#606060",
 "vrPointerSelectionTime": 2000,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "shadow": false,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingRight": 6,
 "paddingRight": 0,
 "progressBarOpacity": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "toolTipBorderSize": 1,
 "toolTipDisplayTime": 600,
 "toolTipPaddingLeft": 6,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBarBorderColor": "#0066FF",
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "playbackBarLeft": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "progressBorderColor": "#FFFFFF",
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "paddingBottom": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "toolTipBorderColor": "#767676",
 "class": "ViewerArea",
 "toolTipFontSize": 12,
 "paddingTop": 0,
 "toolTipPaddingBottom": 4,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Floor Plan"
 },
 "toolTipShadowColor": "#333333",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6
},
{
 "horizontalAlign": "left",
 "children": [
  "this.IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E"
 ],
 "layout": "absolute",
 "id": "Container_2F8A7686_0D4F_6B71_41A9_1A894413085C",
 "width": "100%",
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "paddingRight": 0,
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "verticalAlign": "top",
 "height": 140,
 "minWidth": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "gap": 10,
 "paddingBottom": 0,
 "scrollBarWidth": 10,
 "paddingTop": 0,
 "class": "Container",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "header"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
  "this.IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
  "this.IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
  "this.IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1"
 ],
 "layout": "absolute",
 "id": "Container_2A19EC4C_0D3B_DFF0_414D_37145C22C5BC",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "visible",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "height": "100%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container photo"
 }
},
{
 "horizontalAlign": "center",
 "children": [
  "this.Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397"
 ],
 "layout": "absolute",
 "id": "Container_06C5ABA5_1140_A63F_41A9_850CF958D0DB",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 1,
 "width": "55%",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#000000"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "height": "100%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "-left"
 }
},
{
 "horizontalAlign": "left",
 "layout": "absolute",
 "id": "Container_27875147_3F82_7A70_41CC_C0FFBB32BEFD",
 "width": 8,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 1,
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "height": "100%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "orange line"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
  "this.Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
  "this.Container_06C42BA5_1140_A63F_4195_037A0687532F"
 ],
 "layout": "vertical",
 "id": "Container_06C58BA5_1140_A63F_419D_EC83F94F8C54",
 "paddingRight": 60,
 "borderSize": 0,
 "paddingLeft": 60,
 "scrollBarColor": "#0069A3",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 1,
 "width": "45%",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "visible",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 460,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.51,
 "height": "100%",
 "gap": 0,
 "scrollBarMargin": 2,
 "paddingBottom": 20,
 "paddingTop": 20,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "-right"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 60,
 "id": "IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81",
 "maxHeight": 60,
 "width": "25%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": "75%",
 "rollOverIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_rollover.jpg",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81_pressed.jpg",
 "mode": "push",
 "click": "this.setComponentVisibility(this.Container_06C41BA5_1140_A63F_41AE_B0CBD78DEFDC, false, 0, null, null, false)",
 "paddingBottom": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_06C40BA5_1140_A63F_41AC_FA560325FD81.jpg",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "X"
 }
},
{
 "maxWidth": 2000,
 "id": "Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A",
 "left": "0%",
 "maxHeight": 1000,
 "width": "100%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "url": "skin/Image_062A182F_1140_E20B_41B0_9CB8FFD6AA5A.jpg",
 "minHeight": 1,
 "borderRadius": 0,
 "top": "0%",
 "propagateClick": false,
 "verticalAlign": "middle",
 "height": "100%",
 "minWidth": 1,
 "paddingBottom": 0,
 "paddingTop": 0,
 "class": "Image",
 "scaleMode": "fit_outside",
 "horizontalAlign": "center",
 "shadow": false,
 "data": {
  "name": "photo"
 }
},
{
 "horizontalAlign": "right",
 "layout": "horizontal",
 "id": "Container_062A3830_1140_E215_4195_1698933FE51C",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "minHeight": 0,
 "borderRadius": 0,
 "overflow": "scroll",
 "height": 60,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "gap": 0,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 20,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "Container space"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.HTMLText_062AD830_1140_E215_41B0_321699661E7F",
  "this.Button_062AF830_1140_E215_418D_D2FC11B12C47"
 ],
 "layout": "vertical",
 "id": "Container_062A2830_1140_E215_41AA_EB25B7BD381C",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#E73B2C",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "minHeight": 520,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 100,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.79,
 "height": "100%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 30,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container text"
 }
},
{
 "horizontalAlign": "left",
 "layout": "horizontal",
 "id": "Container_062AE830_1140_E215_4180_196ED689F4BD",
 "width": 370,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "height": 40,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container space"
 }
},
{
 "horizontalAlign": "right",
 "maxWidth": 60,
 "id": "IconButton_38922473_0C06_2593_4199_C585853A1AB3",
 "maxHeight": 60,
 "width": "100%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": 20,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "top": 20,
 "propagateClick": false,
 "verticalAlign": "top",
 "height": "36.14%",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_pressed.jpg",
 "mode": "push",
 "rollOverIconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3_rollover.jpg",
 "click": "this.setComponentVisibility(this.Container_39DE87B1_0C06_62AF_417B_8CB0FB5C9D15, false, 0, null, null, false)",
 "paddingBottom": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_38922473_0C06_2593_4199_C585853A1AB3.jpg",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton X"
 }
},
{
 "horizontalAlign": "right",
 "maxWidth": 60,
 "id": "IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E",
 "maxHeight": 60,
 "width": "100%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": 20,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "top": 20,
 "propagateClick": false,
 "verticalAlign": "top",
 "height": "36.14%",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_pressed.jpg",
 "mode": "push",
 "rollOverIconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E_rollover.jpg",
 "click": "this.setComponentVisibility(this.Container_2F8BB687_0D4F_6B7F_4190_9490D02FBC41, false, 0, null, null, false)",
 "paddingBottom": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2F8A5686_0D4F_6B71_41A1_13CF877A165E.jpg",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton X"
 }
},
{
 "toolTipFontWeight": "normal",
 "playbackBarBackgroundColorDirection": "vertical",
 "id": "ViewerAreaLabeled_2A198C4C_0D3B_DFF0_419F_C9A785406D9C",
 "left": "0%",
 "playbackBarRight": 0,
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBarBorderRadius": 0,
 "width": "100%",
 "paddingLeft": 0,
 "playbackBarBorderRadius": 0,
 "toolTipShadowOpacity": 1,
 "minHeight": 1,
 "playbackBarProgressBorderColor": "#000000",
 "toolTipFontStyle": "normal",
 "playbackBarHeadBorderColor": "#000000",
 "toolTipFontFamily": "Arial",
 "progressLeft": 0,
 "propagateClick": false,
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBorderRadius": 0,
 "height": "100%",
 "minWidth": 1,
 "playbackBarBorderSize": 0,
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "vrPointerSelectionColor": "#FF6600",
 "playbackBarBackgroundOpacity": 1,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "toolTipShadowHorizontalLength": 0,
 "playbackBarHeadShadowColor": "#000000",
 "progressRight": 0,
 "toolTipShadowVerticalLength": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "toolTipBackgroundColor": "#F6F6F6",
 "progressBarBackgroundColorDirection": "vertical",
 "toolTipFontColor": "#606060",
 "vrPointerSelectionTime": 2000,
 "progressHeight": 10,
 "playbackBarHeadShadow": true,
 "progressBottom": 2,
 "shadow": false,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "vrPointerColor": "#FFFFFF",
 "toolTipPaddingRight": 6,
 "paddingRight": 0,
 "progressBarOpacity": 1,
 "borderSize": 0,
 "toolTipPaddingTop": 4,
 "toolTipBorderSize": 1,
 "toolTipDisplayTime": 600,
 "toolTipPaddingLeft": 6,
 "progressBorderSize": 0,
 "displayTooltipInTouchScreens": true,
 "progressBorderRadius": 0,
 "playbackBarBorderColor": "#FFFFFF",
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorRatios": [
  0.01
 ],
 "playbackBarHeadHeight": 15,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "top": "0%",
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBarBorderColor": "#0066FF",
 "playbackBarHeadShadowVerticalLength": 0,
 "progressBarBackgroundColorRatios": [
  0
 ],
 "progressBackgroundColorDirection": "vertical",
 "transitionDuration": 500,
 "playbackBarHeadOpacity": 1,
 "playbackBarBottom": 0,
 "progressBorderColor": "#FFFFFF",
 "playbackBarLeft": 0,
 "toolTipShadowSpread": 0,
 "toolTipShadowBlurRadius": 3,
 "paddingBottom": 0,
 "toolTipTextShadowColor": "#000000",
 "toolTipOpacity": 1,
 "toolTipBorderColor": "#767676",
 "class": "ViewerArea",
 "toolTipFontSize": 12,
 "paddingTop": 0,
 "toolTipPaddingBottom": 4,
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "toolTipTextShadowBlurRadius": 3,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "data": {
  "name": "Viewer photoalbum 1"
 },
 "toolTipShadowColor": "#333333",
 "playbackBarHeight": 10,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6
},
{
 "horizontalAlign": "center",
 "maxWidth": 60,
 "id": "IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482",
 "left": 10,
 "maxHeight": 60,
 "width": "14.22%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "top": "20%",
 "propagateClick": false,
 "verticalAlign": "middle",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_pressed.png",
 "bottom": "20%",
 "rollOverIconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482_rollover.png",
 "paddingBottom": 0,
 "mode": "push",
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19BC4C_0D3B_DFF0_419F_D0DCB12FF482.png",
 "class": "IconButton",
 "shadow": false,
 "cursor": "hand",
 "data": {
  "name": "IconButton <"
 }
},
{
 "horizontalAlign": "center",
 "maxWidth": 60,
 "id": "IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510",
 "maxHeight": 60,
 "width": "14.22%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": 10,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "top": "20%",
 "propagateClick": false,
 "verticalAlign": "middle",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_pressed.png",
 "bottom": "20%",
 "rollOverIconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510_rollover.png",
 "paddingBottom": 0,
 "mode": "push",
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19AC4C_0D3B_DFF0_4181_A2C230C2E510.png",
 "class": "IconButton",
 "shadow": false,
 "cursor": "hand",
 "data": {
  "name": "IconButton >"
 }
},
{
 "horizontalAlign": "right",
 "maxWidth": 60,
 "id": "IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1",
 "maxHeight": 60,
 "width": "10%",
 "paddingRight": 0,
 "borderSize": 0,
 "right": 20,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "minHeight": 50,
 "borderRadius": 0,
 "top": 20,
 "propagateClick": false,
 "verticalAlign": "top",
 "height": "10%",
 "minWidth": 50,
 "pressedIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_pressed.jpg",
 "mode": "push",
 "rollOverIconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1_rollover.jpg",
 "click": "this.setComponentVisibility(this.Container_2A1A5C4D_0D3B_DFF0_41A9_8FC811D03C8E, false, 0, null, null, false)",
 "paddingBottom": 0,
 "paddingTop": 0,
 "transparencyActive": false,
 "iconURL": "skin/IconButton_2A19CC4C_0D3B_DFF0_41AA_D2AC34177CF1.jpg",
 "class": "IconButton",
 "cursor": "hand",
 "shadow": false,
 "data": {
  "name": "IconButton X"
 }
},
{
 "maxWidth": 2000,
 "id": "Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397",
 "left": "0%",
 "maxHeight": 1000,
 "width": "100%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "url": "skin/Image_06C5BBA5_1140_A63F_41A7_E6D01D4CC397.jpg",
 "minHeight": 1,
 "borderRadius": 0,
 "top": "0%",
 "propagateClick": false,
 "verticalAlign": "bottom",
 "height": "100%",
 "minWidth": 1,
 "paddingBottom": 0,
 "paddingTop": 0,
 "class": "Image",
 "scaleMode": "fit_outside",
 "horizontalAlign": "center",
 "shadow": false,
 "data": {
  "name": "Image"
 }
},
{
 "horizontalAlign": "right",
 "layout": "horizontal",
 "id": "Container_06C59BA5_1140_A63F_41B1_4B41E3B7D98D",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "minHeight": 0,
 "borderRadius": 0,
 "overflow": "scroll",
 "height": 60,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "gap": 0,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 20,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "shadow": false,
 "contentOpaque": false,
 "data": {
  "name": "Container space"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
  "this.Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C"
 ],
 "layout": "vertical",
 "id": "Container_06C46BA5_1140_A63F_4151_B5A20B4EA86A",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#E73B2C",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "minHeight": 520,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 100,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.79,
 "height": "100%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 30,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container text"
 }
},
{
 "horizontalAlign": "left",
 "layout": "horizontal",
 "id": "Container_06C42BA5_1140_A63F_4195_037A0687532F",
 "width": 370,
 "borderSize": 0,
 "paddingRight": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "height": 40,
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Container space"
 }
},
{
 "id": "HTMLText_062AD830_1140_E215_41B0_321699661E7F",
 "paddingRight": 10,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 10,
 "scrollBarColor": "#F7931E",
 "width": "100%",
 "minHeight": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "height": "100%",
 "minWidth": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "paddingBottom": 20,
 "scrollBarWidth": 10,
 "paddingTop": 0,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f7931e;font-size:6.99vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:3.61vh;font-family:'Montserrat';\"><B>LOREM IPSUM</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:3.61vh;font-family:'Montserrat';\"><B>DOLOR SIT AMET</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:1.86vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f7931e;font-size:1.86vh;font-family:'Montserrat';\"><B>CONSECTETUR ADIPISCING ELIT. MORBI BIBENDUM PHARETRA LOREM, ACCUMSAN SAN NULLA.</B></SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:0.77vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:0.77vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV><p STYLE=\"margin:0; line-height:0.77vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\">Integer gravida dui quis euismod placerat. Maecenas quis accumsan ipsum. Aliquam gravida velit at dolor mollis, quis luctus mauris vulputate. Proin condimentum id nunc sed sollicitudin.</SPAN></DIV><p STYLE=\"margin:0; line-height:1.86vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.86vh;font-family:'Montserrat';\"><B>DONEC FEUGIAT:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.64vh;\"> </SPAN>\u2022 Nisl nec mi sollicitudin facilisis </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Nam sed faucibus est.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Ut eget lorem sed leo.</SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Sollicitudin tempor sit amet non urna. </SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"> \u2022 Aliquam feugiat mauris sit amet.</SPAN></DIV><p STYLE=\"margin:0; line-height:1.86vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.86vh;font-family:'Montserrat';\"><B>LOREM IPSUM:</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f7931e;font-size:2.3vh;font-family:'Oswald';\"><B>$150,000</B></SPAN></SPAN></DIV></div>",
 "shadow": false,
 "data": {
  "name": "HTMLText"
 }
},
{
 "horizontalAlign": "center",
 "fontColor": "#FFFFFF",
 "shadowBlurRadius": 6,
 "id": "Button_062AF830_1140_E215_418D_D2FC11B12C47",
 "pressedBackgroundColor": [
  "#000000"
 ],
 "width": 180,
 "layout": "horizontal",
 "fontFamily": "Montserrat",
 "shadowColor": "#000000",
 "borderSize": 0,
 "paddingRight": 0,
 "iconHeight": 32,
 "paddingLeft": 0,
 "shadowSpread": 1,
 "backgroundOpacity": 0.8,
 "minHeight": 1,
 "borderRadius": 0,
 "borderColor": "#000000",
 "height": 50,
 "pressedBackgroundColorRatios": [
  0
 ],
 "backgroundColorRatios": [
  0
 ],
 "propagateClick": false,
 "verticalAlign": "middle",
 "backgroundColor": [
  "#F7931E"
 ],
 "minWidth": 1,
 "label": "LOREM IPSUM",
 "pressedBackgroundOpacity": 1,
 "mode": "push",
 "gap": 5,
 "iconBeforeLabel": true,
 "fontSize": "1.96vh",
 "paddingBottom": 0,
 "fontStyle": "normal",
 "paddingTop": 0,
 "class": "Button",
 "iconWidth": 32,
 "backgroundColorDirection": "vertical",
 "fontWeight": "bold",
 "textDecoration": "none",
 "cursor": "hand",
 "rollOverBackgroundOpacity": 1,
 "shadow": false,
 "data": {
  "name": "Button Lorem Ipsum"
 }
},
{
 "id": "HTMLText_0B42C466_11C0_623D_4193_9FAB57A5AC33",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#04A3E1",
 "width": "100%",
 "minHeight": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "height": "45%",
 "minWidth": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "paddingBottom": 10,
 "scrollBarWidth": 10,
 "paddingTop": 0,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f7931e;font-size:6.99vh;font-family:'Bebas Neue Bold';\">___</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:3.61vh;font-family:'Montserrat';\"><B>LOREM IPSUM</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:3.61vh;font-family:'Montserrat';\"><B>DOLOR SIT AMET</B></SPAN></SPAN></DIV></div>",
 "shadow": false,
 "data": {
  "name": "HTMLText18899"
 }
},
{
 "horizontalAlign": "left",
 "children": [
  "this.Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
  "this.HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE"
 ],
 "layout": "horizontal",
 "id": "Container_0D9BF47A_11C0_E215_41A4_A63C8527FF9C",
 "paddingRight": 0,
 "borderSize": 0,
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "creationPolicy": "inAdvance",
 "backgroundOpacity": 0.3,
 "width": "100%",
 "minHeight": 1,
 "borderRadius": 0,
 "overflow": "scroll",
 "backgroundColorRatios": [
  0,
  1
 ],
 "propagateClick": false,
 "verticalAlign": "top",
 "backgroundColor": [
  "#FFFFFF",
  "#FFFFFF"
 ],
 "minWidth": 1,
 "scrollBarVisible": "rollOver",
 "scrollBarOpacity": 0.5,
 "height": "80%",
 "gap": 10,
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "class": "Container",
 "backgroundColorDirection": "vertical",
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "- content"
 }
},
{
 "maxWidth": 200,
 "id": "Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0",
 "maxHeight": 200,
 "width": "25%",
 "paddingRight": 0,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 0,
 "url": "skin/Image_0B48D65D_11C0_6E0F_41A2_4D6F373BABA0.jpg",
 "minHeight": 1,
 "borderRadius": 0,
 "propagateClick": false,
 "verticalAlign": "top",
 "height": "100%",
 "minWidth": 1,
 "paddingBottom": 0,
 "paddingTop": 0,
 "class": "Image",
 "scaleMode": "fit_inside",
 "horizontalAlign": "left",
 "shadow": false,
 "data": {
  "name": "agent photo"
 }
},
{
 "id": "HTMLText_0B4B0DC1_11C0_6277_41A4_201A5BB3F7AE",
 "paddingRight": 10,
 "borderSize": 0,
 "backgroundOpacity": 0,
 "paddingLeft": 10,
 "scrollBarColor": "#F7931E",
 "width": "75%",
 "minHeight": 1,
 "borderRadius": 0,
 "scrollBarVisible": "rollOver",
 "propagateClick": false,
 "height": "100%",
 "minWidth": 1,
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "paddingBottom": 10,
 "scrollBarWidth": 10,
 "paddingTop": 0,
 "class": "HTMLText",
 "html": "<div style=\"text-align:left; color:#000; \"><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#f7931e;font-size:1.97vh;font-family:'Montserrat';\"><B>JOHN DOE</B></SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"font-size:1.64vh;font-family:'Montserrat';\">LICENSED REAL ESTATE SALESPERSON</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:0.77vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-family:'Montserrat';\">Tlf.: +11 111 111 111</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-family:'Montserrat';\">jhondoe@realestate.com</SPAN></SPAN></DIV><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"><SPAN STYLE=\"color:#999999;font-family:'Montserrat';\">www.loremipsum.com</SPAN></SPAN></DIV><p STYLE=\"margin:0; line-height:0.77vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><p STYLE=\"margin:0; line-height:0.77vh;\"><BR STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\"/></p><DIV STYLE=\"text-align:left;\"><SPAN STYLE=\"letter-spacing:0vh;color:#000000;font-size:0.77vh;font-family:Arial, Helvetica, sans-serif;\">Mauris aliquet neque quis libero consequat vestibulum. Donec lacinia consequat dolor viverra sagittis. Praesent consequat porttitor risus, eu condimentum nunc. Proin et velit ac sapien luctus efficitur egestas ac augue. Nunc dictum, augue eget eleifend interdum, quam libero imperdiet lectus, vel scelerisque turpis lectus vel ligula. Duis a porta sem. Maecenas sollicitudin nunc id risus fringilla, a pharetra orci iaculis. Aliquam turpis ligula, tincidunt sit amet consequat ac, imperdiet non dolor.</SPAN></DIV></div>",
 "shadow": false,
 "data": {
  "name": "HTMLText19460"
 }
}],
 "gap": 10,
 "buttonToggleMute": "this.Button_4C5C0864_5A8E_C472_41C4_7C0748488A41",
 "scrollBarMargin": 2,
 "paddingBottom": 0,
 "backgroundPreloadEnabled": true,
 "paddingTop": 0,
 "scrollBarWidth": 10,
 "mouseWheelEnabled": true,
 "class": "Player",
 "vrPolyfillScale": 0.5,
 "mobileMipmappingEnabled": false,
 "contentOpaque": false,
 "shadow": false,
 "data": {
  "name": "Player468"
 }
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
