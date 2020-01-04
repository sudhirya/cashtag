//
//  RNAppleMusicPlayerManager.m
//  ChilllApp
//
//  Created by Michael Lee on 4/26/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RNAppleMusicPlayerManager.h"
#import "RNAppleMusicPlayer.h"
#import <React/RCTBridge.h>
#import <AVFoundation/AVFoundation.h>

@implementation RNAppleMusicPlayerManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view
{
  return [[RNAppleMusicPlayer alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_VIEW_PROPERTY(storeId, NSString);
RCT_EXPORT_VIEW_PROPERTY(paused, BOOL);
RCT_EXPORT_VIEW_PROPERTY(seek, float);
/* Should support: onLoadStart, onLoad, and onError to stay consistent with Image */
RCT_EXPORT_VIEW_PROPERTY(onAudioLoad, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onAudioEnd, RCTBubblingEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onAudioProgress, RCTBubblingEventBlock);

@end
