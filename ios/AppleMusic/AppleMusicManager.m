//
//  AppleMusicManager.m
//  ChilllApp
//
//  Created by Michael Lee on 4/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "AppleMusicManager.h"
#import "AppleMusicApi.h"

NSString * const testDeveloperToken = @"eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJSMjNXUjdWMjcifQ.eyJpc3MiOiI1WVlaWDdUQlg2IiwiaWF0IjoxNTMwMjY2OTMwLCJleHAiOjE1NjAyNjY5MzB9.4HvG64rtH9eHcZCtVRPd0htpSPpTbwcAllNm_QRUSiPPYD5tSzD30PvQwHexQ8h_N9hC3RZnzPkh4m9F0Q14_Q";
NSString * const chilllPlaylist = @"Chilll Mix";

@interface AppleMusicManager ()

@property (nonatomic, retain) SKCloudServiceController *cloudServiceController;
@property (nonatomic, retain) id cloudServiceCapabilitiesDidChangeObserver;
@property (nonatomic, retain) id storefrontCountryCodeDidChangeObserver;

@end

@implementation AppleMusicManager

+ (AppleMusicManager *)shared {
  static dispatch_once_t onceToken;
  static AppleMusicManager * instance;
  dispatch_once(&onceToken, ^{
    instance = [[AppleMusicManager alloc] init];
  });
  return instance;
}

- (instancetype)init {
  if (self = [super init]) {
    NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
    self.userToken = nil; //[userDefault stringForKey:@"chilll.applemusic.user.token"];
    self.devToken = testDeveloperToken;
    self.cloudServiceController = [[SKCloudServiceController alloc] init];
  }
  return self;
}

- (void)dealloc {
  [self stopObserver];
}

- (void)startObserver {
  if (self.cloudServiceCapabilitiesDidChangeObserver != nil) return;
  
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  self.cloudServiceCapabilitiesDidChangeObserver = [center addObserverForName:SKCloudServiceCapabilitiesDidChangeNotification
                                                                       object:nil
                                                                        queue:nil
                                                                   usingBlock:^(NSNotification *notification)
  {
    [self requestCloudServiceCapabilities:nil];
  }];
  
  if (@available(iOS 11.0, *)) {
    self.storefrontCountryCodeDidChangeObserver = [center addObserverForName:SKStorefrontCountryCodeDidChangeNotification
                                                                      object:nil
                                                                       queue:nil
                                                                  usingBlock:^(NSNotification *notification)
    {
      [self requestStorefrontCountryCode:nil];
    }];
  }
}

- (void)stopObserver {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  if (self.cloudServiceCapabilitiesDidChangeObserver != nil) {
    [center removeObserver:self.cloudServiceCapabilitiesDidChangeObserver];
    self.cloudServiceCapabilitiesDidChangeObserver = nil;
  }
  
  if (@available(iOS 11.0, *)) {
    if (self.storefrontCountryCodeDidChangeObserver != nil) {
      [center removeObserver:self.storefrontCountryCodeDidChangeObserver];
      self.storefrontCountryCodeDidChangeObserver = nil;
    }
  }
}

// MARK: Authorization Request Methods
+ (void) requestAuthorization:(void (^)(bool authorized))completion {
  [self requestCloudServiceAuthorization:^(SKCloudServiceAuthorizationStatus serviceAuthStatus) {
    if (serviceAuthStatus != SKCloudServiceAuthorizationStatusAuthorized) {
      if (completion != nil) completion(false);
      return;
    }
    
    [self requestMediaLibraryAuthorization:^(MPMediaLibraryAuthorizationStatus mediaAuthStatus) {
      if (mediaAuthStatus != MPMediaLibraryAuthorizationStatusAuthorized) {
        if (completion != nil) completion(false);
        return;
      }
      
      [self.shared startObserver];
      [self.shared requestCloudServiceCapabilities:nil];
      
      if (completion != nil) completion(true);
    }];
  }];
}

+ (void) requestUserToken:(void (^)(NSString *userToken))completion {
  [self.shared requestUserToken:^(NSString *userToken) {
    if (userToken == nil) {
      if (completion != nil) completion(userToken);
      return;
    }
    
    [self.shared requestStorefrontCountryCode:^(NSString *countryCode) {
      if (completion != nil) completion(userToken);
    }];
  }];
}

+ (void) requestCloudServiceAuthorization:(void (^)(SKCloudServiceAuthorizationStatus status))completion {
  SKCloudServiceAuthorizationStatus status = [SKCloudServiceController authorizationStatus];
  if (status != SKCloudServiceAuthorizationStatusNotDetermined) {
    if (completion != nil) completion(status);
  } else {
    [SKCloudServiceController requestAuthorization:^(SKCloudServiceAuthorizationStatus status) {
      if (completion != nil) completion(status);
    }];
  }
}

+ (void) requestMediaLibraryAuthorization:(void (^)(MPMediaLibraryAuthorizationStatus status))completion {
  MPMediaLibraryAuthorizationStatus status = [MPMediaLibrary authorizationStatus];
  if (status != MPMediaLibraryAuthorizationStatusNotDetermined) {
    if (completion != nil) completion(status);
  } else {
    [MPMediaLibrary requestAuthorization:^(MPMediaLibraryAuthorizationStatus status) {
      if (completion != nil) completion(status);
    }];
  }
}

- (void) requestCloudServiceCapabilities:(void (^)(SKCloudServiceCapability capabilities, NSError * _Nullable error))completion {
  [self.cloudServiceController requestCapabilitiesWithCompletionHandler:^(SKCloudServiceCapability capabilities, NSError * _Nullable error) {
    if (error == nil) {
      self.capabilities = capabilities;
    }
    if (completion != nil) completion(capabilities, error);
  }];
}

- (void)requestStorefrontCountryCode:(void (^)(NSString *))completion {
  if (self.storefrontCountryCode != nil && self.storefrontCountryCode.length > 0) {
    if (completion != nil) completion(self.storefrontCountryCode);
    return;
  }
  
  SKCloudServiceAuthorizationStatus status = [SKCloudServiceController authorizationStatus];
  if (status != SKCloudServiceAuthorizationStatusAuthorized) {
    if (completion != nil) completion(nil);
    return;
  }
  
  void (^requestCompletion)(NSString *, NSError *) = ^(NSString *countryCode, NSError *error) {
    self.storefrontCountryCode = countryCode;
    if (completion != nil) completion(countryCode);
  };
  
  if (status == SKCloudServiceAuthorizationStatusAuthorized) {
    if (@available(iOS 11.0, *)) {
      [self.cloudServiceController requestStorefrontCountryCodeWithCompletionHandler:requestCompletion];
      
    } else {
      if (self.devToken == nil || self.userToken == nil) {
        requestCompletion(nil, nil);
        return;
      }
      
      [AppleMusicApi requestUserStorefrontWithUserToken:self.userToken developerToken:self.devToken completion:^(NSString *identifier) {
        requestCompletion(identifier, nil);
      }];
    }
  } else {
    if (self.devToken == nil) {
      requestCompletion(nil, nil);
      return;
    }
    
    NSString * regionCode = [[NSLocale currentLocale] objectForKey:NSLocaleCountryCode];
    if (regionCode == nil) regionCode = @"us";
    
    [AppleMusicApi requestStorefrontWithRegionCode:regionCode developerToken:self.devToken completion:^(NSString *identifier) {
      requestCompletion(identifier, nil);
    }];
  }
}

- (void)requestUserToken:(void (^)(NSString *))completion {
  if (self.userToken != nil && self.userToken.length > 0) {
    if (completion != nil) completion(self.userToken);
    return;
  }
  
  if (self.devToken == nil) {
    if (completion != nil) completion(nil);
    return;
  }
  
  SKCloudServiceAuthorizationStatus status = [SKCloudServiceController authorizationStatus];
  if (status != SKCloudServiceAuthorizationStatusAuthorized) {
    if (completion != nil) completion(nil);
    return;
  }
  
  void (^requestCompletion)(NSString *, NSError *) = ^(NSString *userToken, NSError *error) {
    self.userToken = userToken;
    
    if (userToken != nil) {
      NSUserDefaults *userDefault = [NSUserDefaults standardUserDefaults];
      [userDefault setObject:userToken forKey:@"chilll.applemusic.user.token"];
    }
    
    if (completion != nil) completion(userToken);
  };

  if (@available(iOS 11.0, *)) {
    [self.cloudServiceController requestUserTokenForDeveloperToken:self.devToken completionHandler:requestCompletion];
  } else {
    [self.cloudServiceController requestPersonalizationTokenForClientToken:self.devToken withCompletionHandler:requestCompletion];
  }
}

+ (NSArray<MPMediaItemCollection *> *)getChilllPlaylists {
    MPMediaQuery *queryPlaylists = [MPMediaQuery playlistsQuery];
    [queryPlaylists addFilterPredicate:[MPMediaPropertyPredicate predicateWithValue:chilllPlaylist forProperty:MPMediaPlaylistPropertyName]];
    return queryPlaylists.collections;
}

+ (NSArray<MPMediaItem *> *)getChilllSongs {
  NSMutableArray<MPMediaItem *> *items = [[NSMutableArray alloc] init];
  
  NSArray<MPMediaItemCollection *> *playlists = [self getChilllPlaylists];
  if (playlists == nil) return items;
  
  for (MPMediaItemCollection *playlist in playlists) {
    NSArray<MPMediaItem *> *playlistItems = playlist.items;
    if (playlistItems == nil) continue;
    
    [items addObjectsFromArray:playlistItems];
  }
  
  return items;
}

+ (void)createChilllPlaylist:(void (^)(MPMediaPlaylist *))completion {
  NSUUID * playlistUUID = [NSUUID new];
  MPMediaPlaylistCreationMetadata *metaData = [[MPMediaPlaylistCreationMetadata alloc] initWithName:chilllPlaylist];
  
  [metaData setAuthorDisplayName:@"Apple Music for Chilll App"];
  [metaData setDescriptionText:@"This playlist was created using Chilll App."];
  
  [[MPMediaLibrary defaultMediaLibrary] getPlaylistWithUUID:playlistUUID creationMetadata:metaData completionHandler:^(MPMediaPlaylist * _Nullable playlist, NSError * _Nullable error) {
    if (completion != nil) completion(error == nil && playlist != nil ? playlist : nil);
  }];
}

+ (NSArray<MPMediaItemCollection *> *)getPlaylists {
  MPMediaQuery *queryPlaylists = [MPMediaQuery playlistsQuery];
  return queryPlaylists.collections;
}

+ (NSArray<MPMediaItem *> *)getSongs:(MPMediaItemCollection *)playlist {
  NSMutableArray<MPMediaItem *> *items = [[NSMutableArray alloc] init];
  if (playlist != nil) {
    NSArray *playlistItems = playlist.items;;
    if (playlistItems != nil) {
      [items addObjectsFromArray:playlistItems];
    }
  }
  return items;
}

+ (NSArray<AppleMusicExportItem *> *)exportSongs:(NSArray<MPMediaItem *> *)songs {
  NSMutableArray<AppleMusicExportItem *> *exports = [[NSMutableArray alloc] init];
  for (MPMediaItem *song in songs) {
    AppleMusicExportItem *exportItem = [[AppleMusicExportItem alloc] initWithMediaItem:song];
    [exports addObject:exportItem];
  }
  return exports;
}

+ (NSString *)getSongAssetUrl:(NSString *)persistentId {
  MPMediaPredicate *predictate = [MPMediaPropertyPredicate predicateWithValue:persistentId
                                                                  forProperty:MPMediaItemPropertyPersistentID];
  if (predictate == nil) return nil;
  MPMediaQuery *query = MPMediaQuery.songsQuery;
  [query addFilterPredicate:predictate];
  NSArray<MPMediaItemCollection *> *collections = query.collections;
  NSArray<MPMediaItem *> *items = query.items;
  if (items == nil || items.count == 0) return nil;
  MPMediaItem *item = items.firstObject;
  if (item.assetURL == nil) return nil;
  return [item.assetURL absoluteString];
}

@end
