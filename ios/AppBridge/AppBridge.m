//
//  AppBridge.m
//  chilllMobile
//
//  Created by Michael Lee on 3/17/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "AppBridge.h"
#import <React/RCTUtils.h>
#import <StoreKit/StoreKit.h>
#import "NowPlaying.h"
#import "AppDelegate.h"
#import <AVFoundation/AVFoundation.h>
#import <AudioToolbox/AudioToolbox.h>

NSUInteger audioOption = 0;

@interface AppBridge () <NowPlayingDelegate>

@end

@implementation AppBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setNowPlaying:(BOOL)playing thumb:(NSString *)thumbUrl title:(NSString *)title artist:(NSString *)artist)
{
  [[NowPlaying sharedInstance] setNowPlaying:playing thumb:thumbUrl title:title artist:artist delegate:self];
}

RCT_EXPORT_METHOD(getMusicToken:(RCTResponseSenderBlock)callback)
{
  [self requestMusicToken:^(NSString *userToken, NSString *error) {
    if (error != nil) {
      callback(@[[NSNull null], error]);
    } else {
      callback(@[userToken, [NSNull null]]);
    }
  }];
}

RCT_EXPORT_METHOD(startNormalPlaying:(RCTResponseSenderBlock)callback)
{
  if (audioOption == AVAudioSessionCategoryOptionDefaultToSpeaker | AVAudioSessionCategoryOptionAllowBluetooth) {
    callback(@[]);
    return;
  }
  
  audioOption = AVAudioSessionCategoryOptionDefaultToSpeaker | AVAudioSessionCategoryOptionAllowBluetooth;
  
  NSError * sessionError;
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord
                                   withOptions:audioOption
                                         error:&sessionError];
  callback(@[]);
}

RCT_EXPORT_METHOD(startOtherPlaying:(RCTResponseSenderBlock)callback)
{
  if (audioOption == AVAudioSessionCategoryOptionDefaultToSpeaker | AVAudioSessionCategoryOptionMixWithOthers | AVAudioSessionCategoryOptionAllowBluetooth) {
    callback(@[]);
    return;
  }
  audioOption = AVAudioSessionCategoryOptionDefaultToSpeaker | AVAudioSessionCategoryOptionMixWithOthers | AVAudioSessionCategoryOptionAllowBluetooth;
  
  NSError * sessionError;
  [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayAndRecord
                                   withOptions:audioOption
                                         error:&sessionError];
  callback(@[]);
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onRemotePlayEvent"];
}

- (void)onRemotePlay {
  [self sendEventWithName:@"onRemotePlayEvent" body:@{@"type" : @"play"}];
}

- (void)onRemotePause {
  [self sendEventWithName:@"onRemotePlayEvent" body:@{@"type" : @"pause"}];
}

- (void)onRemoteToggle {
  [self sendEventWithName:@"onRemotePlayEvent" body:@{@"type" : @"toggle"}];
}

- (void)onRemotePrev {
  [self sendEventWithName:@"onRemotePlayEvent" body:@{@"type" : @"prev"}];
}

- (void)onRemoteNext {
  [self sendEventWithName:@"onRemotePlayEvent" body:@{@"type" : @"next"}];
}

- (void)requestMusicToken:(void(^)(NSString * userToken, NSString * error))callback {
  SKCloudServiceAuthorizationStatus authStatus = [SKCloudServiceController authorizationStatus];
  if (authStatus == SKCloudServiceAuthorizationStatusNotDetermined) {
    [SKCloudServiceController requestAuthorization:^(SKCloudServiceAuthorizationStatus status) {
      if (status == SKCloudServiceAuthorizationStatusAuthorized) {
        [self _requestMusicToken:callback];
      }
    }];
  } else if (authStatus == SKCloudServiceAuthorizationStatusDenied) {
    callback(nil, @"Access Denied");
  } else if (authStatus == SKCloudServiceAuthorizationStatusAuthorized) {
    [self _requestMusicToken:callback];
  }
}

- (void)_requestMusicToken:(void(^)(NSString * userToken, NSString * error))callback {
  NSString * devToken = @"eyJhbGciOiJFUzI1NiIsImtpZCI6IlZFTDUyUlBRN0oifQ.eyJpc3MiOiI1WVlaWDdUQlg2IiwiaWF0IjoiMTUxNjU3OTIwMCIsImV4cCI6IjE1Mjc2Mzg0MDAifQ.JJ2k26t49CGHeJmyJGwopl1IkBUBueigXTs-YAblg6AkDY1IWxcxjUt5UhUeRtzhRZpbnVDYWD9-KPARQ65pLp8lxRe9WXD6OLFqmfd0mVApQcxcHvTfkXy8ALNAloC4DFg4k4Nh89x7qtnpUWiAGA9FWMQvjEWj2cUGGQbJx0o";
  SKCloudServiceController * service = [[SKCloudServiceController alloc] init];
  if (@available(iOS 11.0, *)) {
    [service requestUserTokenForDeveloperToken:devToken completionHandler:^(NSString * _Nullable userToken, NSError * _Nullable error) {
      NSLog(@"user token: %@", userToken);
      if (error != nil) {
        callback(nil, error.localizedDescription);
      } else {
        callback(userToken, nil);
      }
    }];
  } else {
    callback(nil, @"Only available from iOS 11");
  }
}

@end
