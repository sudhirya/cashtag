#import "RNAppleMusic.h"
#import "AVFoundation/AVFoundation.h"
#import <MediaPlayer/MediaPlayer.h>
#import <StoreKit/StoreKit.h>
#import "AppleMusicManager.h"
#import "AppleMusicPlayer.h"

@interface RNAppleMusic ()
@property (nonatomic, assign) BOOL hasListeners;
@end

@implementation RNAppleMusic

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[
           @"onLoad",
           @"onEnd",
           ];
}

RCT_EXPORT_METHOD(authorize:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  [AppleMusicManager requestAuthorization:^(bool authorized) {
    if (authorized) {
      
      resolve(nil);
    } else {
      reject(RCTErrorUnspecified, @"Failed to request SKCloudService Authorization", nil);
    }
  }];
}

RCT_EXPORT_METHOD(userToken:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  [AppleMusicManager requestUserToken:^(NSString *userToken) {
    if (userToken != nil && userToken.length > 0) {
      resolve(userToken);
      AppleMusicPlayer.shared.playbackStateDidChangeBlock = ^{
        [self playbackStateDidChanged];
      };
      AppleMusicPlayer.shared.playbackDidPrepareBlock = ^{
        [self playbackDidPrepared];
      };
      AppleMusicPlayer.shared.nowPlayingItemDidChangeBlock = ^{
        [self nowPlayingItemDidChanged];
      };
    } else {
      reject(RCTErrorUnspecified, @"Failed to request user token", nil);
    }
  }];
}

RCT_EXPORT_METHOD(storefrontCountryCode:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  [AppleMusicManager requestUserToken:^(NSString *userToken) {
    NSString *countryCode = AppleMusicManager.shared.storefrontCountryCode;
    
    if (countryCode != nil && countryCode.length > 0) {
      resolve(countryCode);
    } else {
      reject(RCTErrorUnspecified, @"Invalid store front country code", nil);
    }
  }];
}

RCT_EXPORT_METHOD(createChilllPlaylist:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  [AppleMusicManager createChilllPlaylist:^(MPMediaPlaylist *playlist) {
    if (playlist != nil) resolve(nil);
    else reject(RCTErrorUnspecified, @"Failed to create playlist", nil);
  }];
}

RCT_EXPORT_METHOD(requestChilllPlaylists:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  NSArray *playlists = [AppleMusicManager getChilllPlaylists];
  NSArray *lists = [AppleMusicModel jsonWithPlaylists:playlists includeSong:NO];
  resolve(lists);
}

RCT_EXPORT_METHOD(requestChilllSongs:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  NSArray *songs = [AppleMusicManager getChilllSongs];
  NSArray *lists = [AppleMusicModel jsonWithSongs:songs];
  resolve(lists);
}

RCT_EXPORT_METHOD(requestPlaylists:(BOOL)includeSong
                  resolve:(RCTPromiseResolveBlock)resolve
                  rejecter:(__unused RCTPromiseRejectBlock)reject)
{
  NSArray *playlists = [AppleMusicManager getPlaylists];
  NSArray *lists = [AppleMusicModel jsonWithPlaylists:playlists includeSong:includeSong];
  resolve(lists);
}

RCT_EXPORT_METHOD(loadSong:(NSString *)storeId)
{
  [AppleMusicPlayer.shared loadSongWithStoreId:storeId];
}

RCT_EXPORT_METHOD(play) {
  [AppleMusicPlayer.shared play];
}

RCT_EXPORT_METHOD(pause) {
  [AppleMusicPlayer.shared pause];
}

RCT_EXPORT_METHOD(togglePlay) {
  [AppleMusicPlayer.shared togglePlay];
}

RCT_EXPORT_METHOD(seek:(double)offset) {
  [AppleMusicPlayer.shared seekToOffset:offset];
}

RCT_EXPORT_METHOD(setRate:(float)rate) {
  [AppleMusicPlayer.shared setRate:rate];
}

RCT_EXPORT_METHOD(currentTime:(RCTResponseSenderBlock)block)
{
  block(@[@(AppleMusicPlayer.shared.currentTime)]);
}

RCT_EXPORT_METHOD(duration:(RCTResponseSenderBlock)block)
{
  block(@[@(AppleMusicPlayer.shared.duration)]);
}

RCT_EXPORT_METHOD(playbackState:(RCTResponseSenderBlock)block)
{
  block(@[@(AppleMusicPlayer.shared.playbackState)]);
}

RCT_EXPORT_METHOD(rate:(RCTResponseSenderBlock)block)
{
  block(@[@(AppleMusicPlayer.shared.rate)]);
}

- (void)playbackStateDidChanged {
  NSLog(@"playbackStateDidChagned - %d", AppleMusicPlayer.shared.playbackState);
}

- (void)playbackDidPrepared {
  MPMediaItem *nowPlaying = AppleMusicPlayer.shared.musicPlayerController.nowPlayingItem;
  NSLog(@"playbackDidPrepared - %@", nowPlaying.assetURL.absoluteString);
  [self sendEventWithName:@"onLoad" body:@{@"type" : @"load"}];
}

- (void)nowPlayingItemDidChanged {
  NSLog(@"nowPlayingItemDidChanged - %@", AppleMusicPlayer.shared.musicPlayerController.nowPlayingItem);
  if (AppleMusicPlayer.shared.musicPlayerController.nowPlayingItem == nil) {
    [self sendEventWithName:@"onEnd" body:@{@"type" : @"end"}];
  }
}

@end
