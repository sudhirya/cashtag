//
//  AppleMusicPlayer.h
//  ChilllApp
//
//  Created by Michael Lee on 4/24/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <MediaPlayer/MediaPlayer.h>

@interface AppleMusicPlayer : NSObject

@property (class, nonatomic, strong, readonly) AppleMusicPlayer * shared;

@property (nonatomic, retain, readonly) MPMusicPlayerController *musicPlayerController;

@property (nonatomic, copy) void (^playbackStateDidChangeBlock)(void);
@property (nonatomic, copy) void (^nowPlayingItemDidChangeBlock)(void);
@property (nonatomic, copy) void (^playbackDidPrepareBlock)(void);
@property (nonatomic, assign, readonly) MPMusicPlaybackState playbackState;
@property (nonatomic, assign, readonly) BOOL isPlaying;
@property (nonatomic, assign, readonly) BOOL isPrepared;
@property (nonatomic, assign, readonly) double currentTime;
@property (nonatomic, assign, readonly) double duration;
@property (nonatomic, assign, readonly) CGFloat rate;

- (void)startObserver;
- (void)stopObserver;
- (void)loadSongWithItem:(MPMediaItem *)item;
- (void)loadSongWithStoreId:(NSString *)storeID;
- (void)play;
- (void)pause;
- (void)togglePlay;
- (void)seekToOffset:(double)offset;
- (void)setRate:(CGFloat)rate;
- (void)prepareToPlay;

@end
