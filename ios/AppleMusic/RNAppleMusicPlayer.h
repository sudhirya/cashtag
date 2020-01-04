//
//  RNAppleMusicPlayer.h
//  ChilllApp
//
//  Created by Michael Lee on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <React/RCTView.h>
#import <AVFoundation/AVFoundation.h>
#import <AVKit/AVKit.h>

@class RCTEventDispatcher;

@interface RNAppleMusicPlayer : UIView

@property (nonatomic, copy) RCTBubblingEventBlock onAudioLoad;
@property (nonatomic, copy) RCTBubblingEventBlock onAudioEnd;
@property (nonatomic, copy) RCTBubblingEventBlock onAudioProgress;

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

@end
