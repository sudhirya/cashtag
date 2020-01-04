//
//  AppleMusicPlayer.m
//  ChilllApp
//
//  Created by Michael Lee on 4/24/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "AppleMusicPlayer.h"
#import <MediaPlayer/MediaPlayer.h>

@interface AppleMusicPlayer()

@property (nonatomic, retain) MPMusicPlayerController *musicPlayerController;

@property (nonatomic, retain) id playbackStateDidChangeObserver;
@property (nonatomic, retain) id playbackDidPrepareObserver;
@property (nonatomic, retain) id nowplayingItemDidChangeObserver;

@end

@implementation AppleMusicPlayer

- (instancetype)init {
  if (self = [super init]) {
    self.musicPlayerController = [MPMusicPlayerController applicationMusicPlayer];
    
    [self startObserver];
  }
  return self;
}

- (void)dealloc {
  [self stopObserver];
}

+ (AppleMusicPlayer *)shared {
  static dispatch_once_t onceToken;
  static AppleMusicPlayer * instance;
  dispatch_once(&onceToken, ^{
    instance = [[AppleMusicPlayer alloc] init];
  });
  return instance;
}

- (void)startObserver {
  if (self.playbackStateDidChangeBlock != nil) return;
  
  NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
  
  self.playbackStateDidChangeObserver = [notificationCenter addObserverForName:MPMusicPlayerControllerPlaybackStateDidChangeNotification
                                                                        object:nil
                                                                         queue:nil
                                                                    usingBlock:^(NSNotification * _Nonnull note)
  {
    if (self.playbackStateDidChangeBlock != nil) {
      self.playbackStateDidChangeBlock();
    }
  }];
  
  self.nowplayingItemDidChangeObserver = [notificationCenter addObserverForName:MPMusicPlayerControllerNowPlayingItemDidChangeNotification
                                                                         object:nil
                                                                          queue:nil
                                                                     usingBlock:^(NSNotification * _Nonnull note)
  {
    if (self.nowPlayingItemDidChangeBlock != nil) {
      self.nowPlayingItemDidChangeBlock();
    }
  }];
  
  self.playbackDidPrepareObserver = [notificationCenter addObserverForName:MPMediaPlaybackIsPreparedToPlayDidChangeNotification
                                                                    object:nil
                                                                     queue:nil
                                                                usingBlock:^(NSNotification * _Nonnull note)
  {
    if (self.playbackDidPrepareBlock != nil) {
      self.playbackDidPrepareBlock();
    }
  }];
  
  [self.musicPlayerController beginGeneratingPlaybackNotifications];
}

- (void)stopObserver {
  NSNotificationCenter *notificationCenter = [NSNotificationCenter defaultCenter];
  
  [self.musicPlayerController endGeneratingPlaybackNotifications];
  
  if (self.playbackStateDidChangeObserver != nil) {
    [notificationCenter removeObserver:self.playbackStateDidChangeObserver];
    self.playbackStateDidChangeObserver = nil;
  }
  if (self.playbackDidPrepareObserver != nil) {
    [notificationCenter removeObserver:self.playbackDidPrepareObserver];
    self.playbackDidPrepareObserver = nil;
  }
  if (self.nowplayingItemDidChangeObserver != nil) {
    [notificationCenter removeObserver:self.nowplayingItemDidChangeObserver];
    self.nowplayingItemDidChangeObserver = nil;
  }
}

- (void)loadSongWithItem:(MPMediaItem *)item {
  [self.musicPlayerController setQueueWithItemCollection:@[item]];
  [self.musicPlayerController prepareToPlay];
  [self pause];
}

- (void)loadSongWithStoreId:(NSString *)storeID {
  [self.musicPlayerController setQueueWithStoreIDs:[NSArray arrayWithObject:storeID]];
  [self.musicPlayerController prepareToPlay];
  [self pause];
}

- (void)play {
  if (self.musicPlayerController.nowPlayingItem == nil) return;
  if (self.musicPlayerController.playbackState != MPMusicPlaybackStatePlaying) {
    [self.musicPlayerController play];
    [self.musicPlayerController setCurrentPlaybackRate:1.0];
  }
}

- (void)pause {
  if (self.musicPlayerController.nowPlayingItem == nil) return;
  if (self.musicPlayerController.playbackState == MPMusicPlaybackStatePlaying) {
    [self.musicPlayerController pause];
    [self.musicPlayerController setCurrentPlaybackRate:0.0];
  }
}

- (void)togglePlay {
  if (self.musicPlayerController.nowPlayingItem == nil) return;
  if (self.musicPlayerController.playbackState == MPMusicPlaybackStatePlaying) {
    [self pause];
  } else {
    [self play];
  }
}

- (BOOL)isPlaying {
  if (self.musicPlayerController.nowPlayingItem == nil) return NO;
  return self.musicPlayerController.playbackState == MPMusicPlaybackStatePlaying;
}

- (void)seekToOffset:(double)offset {
  if (self.musicPlayerController.nowPlayingItem == nil) return;
  [self.musicPlayerController setCurrentPlaybackTime:offset];
}

- (CGFloat)rate {
  if (self.musicPlayerController.nowPlayingItem == nil) return 0;
  return self.musicPlayerController.currentPlaybackRate;
}
- (void)setRate:(CGFloat)rate {
  if (self.musicPlayerController.nowPlayingItem == nil) return;
  [self.musicPlayerController setCurrentPlaybackRate:rate];
}

- (MPMusicPlaybackState)playbackState {
  if (self.musicPlayerController.nowPlayingItem == nil) return MPMusicPlaybackStateStopped;
  return self.musicPlayerController.playbackState;
}

- (double)currentTime {
  if (self.musicPlayerController.nowPlayingItem == nil) return 0;
  return self.musicPlayerController.currentPlaybackTime;
}

- (double)duration {
  if (self.musicPlayerController.nowPlayingItem == nil) return 0;
  return [[self.musicPlayerController.nowPlayingItem valueForProperty:MPMediaItemPropertyPlaybackDuration] doubleValue];
}

- (void)prepareToPlay {
  if (self.musicPlayerController.nowPlayingItem == nil) return;
  [self.musicPlayerController prepareToPlay];
}

- (BOOL)isPrepared {
  if (self.musicPlayerController.nowPlayingItem == nil) return NO;
  return [self.musicPlayerController isPreparedToPlay];
}

@end
