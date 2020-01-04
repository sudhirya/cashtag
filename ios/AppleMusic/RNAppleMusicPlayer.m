//
//  RNAppleMusicPlayer.m
//  ChilllApp
//
//  Created by Michael Lee on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTConvert.h>
#import "RNAppleMusicPlayer.h"
#import "AppleMusicPlayer.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventDispatcher.h>
#import <React/UIView+React.h>

#define TIME_SCALE          1000000
#define TIME_IN_SCALE(x)    ((int64_t)((x) * TIME_SCALE))

@interface RNAppleMusicPlayer ()
{
  /* Required to publish events */
  RCTEventDispatcher *_eventDispatcher;
  AppleMusicPlayer *_musicPlayer;
  
  AVPlayer *_timePlayer;
  id _timeObserver;
  
  /* Keep track of any modifiers, need to be applied after each play */
  BOOL _paused;
  BOOL _loading;
  BOOL _ended;
}

@end

@implementation RNAppleMusicPlayer

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
  if ((self = [super init])) {
    _eventDispatcher = eventDispatcher;
    _musicPlayer = AppleMusicPlayer.shared;
    
    NSString * itemPath = [[NSBundle mainBundle] pathForResource:@"empty" ofType:@"mp3"];
    AVPlayerItem * avPlayerItem = [AVPlayerItem playerItemWithURL:[NSURL fileURLWithPath:itemPath]];
    _timePlayer = [AVPlayer playerWithPlayerItem:avPlayerItem];
    _timePlayer.actionAtItemEnd = AVPlayerActionAtItemEndNone;
//    _timePlayer.muted = YES;
  }
  return self;
}

- (void)dealloc
{
  [self setPaused:YES];
  _timePlayer = nil;
}

- (void)setStoreId:(NSString *)storeId {
  _loading = YES;
  _ended = NO;
  
  [_musicPlayer loadSongWithStoreId:storeId];
  [self startObserver];
}

- (void)startObserver {
  if (_timeObserver != nil) return;
  
  NSTimeInterval duration = 25;
  
  __strong typeof(self) strongSelf = self;
  CMTime interval = CMTimeMake(TIME_IN_SCALE(1.0), TIME_SCALE);
  _timeObserver = [_timePlayer addPeriodicTimeObserverForInterval:interval queue:dispatch_get_main_queue() usingBlock:^(CMTime time) {
    NSTimeInterval curTime = CMTimeGetSeconds(time);
    if (curTime > duration) {
      [strongSelf->_timePlayer seekToTime:CMTimeMake(TIME_IN_SCALE(1.0), TIME_SCALE)];
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
      [strongSelf checkAndSendLoad];
      [strongSelf checkAndSendEnd];
      [strongSelf sendProgress];
    });
  }];
  [_timePlayer play];
}
- (void)stopObserver {
  if (_timeObserver == nil) return;
  
  [_timePlayer pause];
  [_timePlayer removeTimeObserver:_timeObserver];
  _timeObserver = nil;
}

- (void)setPaused:(BOOL)paused
{
  _paused = paused;
  
  if (paused) {
    [_musicPlayer pause];
    
    if (!_loading) [self stopObserver];
  } else {
    [_musicPlayer play];
    [self startObserver];
  }
}

- (void)setSeek:(float)seekTime
{
  if (_musicPlayer.isPrepared) {
    [_musicPlayer seekToOffset:seekTime];
  }
}

#pragma mark - React View Management

- (void)insertReactSubview:(UIView *)view atIndex:(NSInteger)atIndex
{
  // We are early in the game and somebody wants to set a subview.
  // That can only be in the context of playerViewController.
  
  view.frame = self.bounds;
}

- (void)removeReactSubview:(UIView *)subview
{
  [subview removeFromSuperview];
}

- (void)removeFromSuperview
{
  [self setPaused:YES];
  
  [super removeFromSuperview];
}

- (void)checkAndSendLoad {
  if (!_loading) return;
  if (!_musicPlayer.isPrepared) return;
  
  if (_paused) [self stopObserver];
  else [self setPaused:NO];
  
  _loading = NO;
  if (self.onAudioLoad) {
    self.onAudioLoad(@{@"duration": [NSNumber numberWithFloat:_musicPlayer.duration],
                       @"currentTime": [NSNumber numberWithFloat:_musicPlayer.currentTime],
                       @"target": self.reactTag});
  }
}

- (void)checkAndSendEnd {
  if (_paused || _loading || _ended) return;
  
  if (_musicPlayer.duration < _musicPlayer.currentTime + 2.0) {
    _ended = YES;
    
    if (self.onAudioEnd) {
      __strong typeof(self) strongSelf = self;
      dispatch_after(dispatch_time(DISPATCH_TIME_NOW, 2 * NSEC_PER_SEC), dispatch_get_main_queue(), ^{
        strongSelf.onAudioEnd(@{@"target": strongSelf.reactTag});
      });
    }
  }
}

- (void)sendProgress {
  if (_paused || _loading || _ended) return;
  
  if (self.onAudioProgress) {
    self.onAudioProgress(@{
                           @"currentTime": [NSNumber numberWithFloat:_musicPlayer.currentTime],
                           @"target": self.reactTag,
                           });
  }
}

@end
