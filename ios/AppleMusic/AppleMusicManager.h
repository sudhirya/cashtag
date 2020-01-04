//
//  AppleMusicManager.h
//  ChilllApp
//
//  Created by Michael Lee on 4/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <StoreKit/StoreKit.h>
#import <MediaPlayer/MediaPlayer.h>
#import "AppleMusicModel.h"

@interface AppleMusicManager : NSObject

@property (class, nonatomic, strong, readonly) AppleMusicManager * shared;

@property (nonatomic, strong) NSString *devToken;
@property (nonatomic, strong) NSString *userToken;
@property (nonatomic, strong) NSString *storefrontCountryCode;
@property (nonatomic, assign) SKCloudServiceCapability capabilities;

+ (void) requestAuthorization:(void (^)(bool authorized))completion;
+ (void) requestUserToken:(void (^)(NSString *userToken))completion;

+ (NSArray<MPMediaItemCollection *> *)getChilllPlaylists;
+ (NSArray<MPMediaItem *> *)getChilllSongs;
+ (void)createChilllPlaylist:(void (^)(MPMediaPlaylist *))completion;

+ (NSArray<MPMediaItemCollection *> *)getPlaylists;
+ (NSArray<MPMediaItem *> *)getSongs:(MPMediaItemCollection *)playlist;

+ (NSArray<AppleMusicExportItem *> *)exportSongs:(NSArray<MPMediaItem *> *)songs;
+ (NSString *)getSongAssetUrl:(NSString *)persistentId;

- (void)startObserver;
- (void)stopObserver;

@end
