//
//  AppleMusicModel.m
//  ChilllApp
//
//  Created by Michael Lee on 4/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "AppleMusicModel.h"
#import "NSDictionary+JSON.h"

// MARK: -
// MARK: AppleMusicModelBase
@implementation AppleMusicModelBase
- (instancetype)init {
  if (self = [super init]) {
    self.valid = YES;
  }
  return self;
}
@end


// MARK: -
// MARK: AppleMusicArtwork
@implementation AppleMusicArtwork

- (instancetype)initWithJson:(NSDictionary*)json {
  if (self = [super init]) {
    self.height = [json integerFor:@"height" default:0];
    self.width = [json integerFor:@"width" default:0];
    self.urlTemplateString = [json optString:@"url"];
    
    self.valid = self.width > 0 && self.height > 0 && self.urlTemplateString != nil && self.urlTemplateString.length > 0;
  }
  return self;
}

// MARK: Image URL Generation Method
- (NSURL*) imageURL:(CGSize)size {
  // 1) Replace the "{w}" placeholder with the desired width as an integer value.
  NSString* imageURLString = [_urlTemplateString stringByReplacingOccurrencesOfString:@"@{w}" withString:[NSString stringWithFormat:@"%d", (int)size.width]];

  // 2) Replace the "{h}" placeholder with the desired height as an integer value.
  imageURLString = [imageURLString stringByReplacingOccurrencesOfString:@"{h}" withString:[NSString stringWithFormat:@"%d", (int)size.height]];

  // 3) Replace the "{f}" placeholder with the desired image format.
  imageURLString = [imageURLString stringByReplacingOccurrencesOfString:@"{f}" withString:@"png"];

  return [NSURL URLWithString:imageURLString];
}

@end


// MARK: -
// MARK: AppleMusicMediaItem
@implementation AppleMusicMediaItem

- (instancetype)initWithJson:(NSDictionary *)json {
  if (self = [super init]) {
    self.identifier = [json optString:@"id"];
    
    NSString* typeString = [json optString:@"type"];
    if ([typeString isEqualToString:@"songs"]) {
      self.type = AppleMusicMediaTypeSongs;
    } else if ([typeString isEqualToString:@"albums"]) {
      self.type = AppleMusicMediaTypeAlbums;
    } else if ([typeString isEqualToString:@"stations"]) {
      self.type = AppleMusicMediaTypeStations;
    } else if ([typeString isEqualToString:@"playlists"]) {
      self.type = AppleMusicMediaTypePlaylists;
    } else {
      self.type = AppleMusicMediaTypeUnknown;
    }
    
    NSDictionary* jsonAttrs = [json optJson:@"attributes"];
    if (jsonAttrs != nil) {
      self.name = [jsonAttrs optString:@"name"];
      self.artistName = [jsonAttrs optString:@"artistName"];
    }
    
    NSDictionary* jsonArtwork = [json optJson:@"artwork"];
    if (jsonArtwork != nil) {
      self.artwork = [[AppleMusicArtwork alloc] initWithJson:jsonArtwork];
    }
    
    self.valid = self.identifier != nil && self.name != nil && self.artwork != nil && self.artwork.valid && self.type != AppleMusicMediaTypeUnknown;
  }
  return self;
}

@end


// MARK: -
// MARK: AppleMusicExportItem
@interface AppleMusicExportItem ()
@property (nonatomic, assign) NSString *persistentId;
@property (nonatomic, retain) NSString *title;
@property (nonatomic, retain) NSString *artist;
@property (nonatomic, retain) NSString *composer;
@property (nonatomic, retain) NSString *thumb;
@property (nonatomic, retain) NSString *storeId;
@end

@implementation AppleMusicExportItem

- (instancetype)initWithMediaItem:(MPMediaItem *)item {
  if (self = [super init]) {
    self.persistentId = [[NSNumber numberWithUnsignedLongLong:item.persistentID] stringValue];
    self.title = item.title;
    self.artist = item.artist;
    self.composer = item.composer;
    self.storeId = item.playbackStoreID;
    if (item.artwork != nil) {
      NSString *path = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject];
      NSString *filePath = [path stringByAppendingPathComponent:[NSString stringWithFormat:@"thumb_ap_%@.png", self.storeId]];
      
      UIImage *thumb = [item.artwork imageWithSize:CGSizeMake(512, 512)];
      NSData *thumbData = UIImagePNGRepresentation(thumb);
      [thumbData writeToFile:filePath atomically:YES];
      self.thumb = filePath;
    }
  }
  return self;
}

@end


// MARK: -
// MARK: AppleMusicModel
@implementation AppleMusicModel

+ (NSDictionary *)jsonWithPlaylist:(MPMediaPlaylist *)playlist {
  return [self jsonWithPlaylist:playlist includeSong:NO];
}

+ (NSDictionary *)jsonWithPlaylist:(MPMediaPlaylist *)playlist includeSong:(BOOL)includeSong {
  return @{
           @"persistentId": [[NSNumber numberWithUnsignedLongLong:playlist.persistentID] stringValue],
           @"name": playlist.name == nil ? @"Unknown" : playlist.name,
           @"description": playlist.description == nil ? @"" : playlist.description,
           @"songs": includeSong ? [self jsonWithSongs:playlist.items] : [NSNull null]
           };
}

+ (NSDictionary *)jsonWithSong:(MPMediaItem *)song {
  NSString *thumbUrl = @"";
//  if (song.artwork != nil) {
//    NSString *path = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) lastObject];
//    NSString *filePath = [path stringByAppendingPathComponent:[NSString stringWithFormat:@"thumb_ap_%@.png", song.playbackStoreID]];
//
//    if (![[NSFileManager defaultManager] fileExistsAtPath:filePath]) {
//      UIImage *thumb = [song.artwork imageWithSize:CGSizeMake(512, 512)];
//      NSData *thumbData = UIImagePNGRepresentation(thumb);
//      [thumbData writeToFile:filePath atomically:YES];
//      thumbUrl = filePath;
//    } else {
//      thumbUrl = filePath;
//    }
//  }
  
  NSMutableArray *artists = [NSMutableArray array];
  if (song.artist != nil) {
    [artists addObject:@{
                         @"stageName": song.artist,
                         }];
  }
  NSMutableArray *albums = [NSMutableArray array];
  if (song.albumTitle != nil) {
    [albums addObject:@{
                        @"name": song.albumTitle,
                        }];
  }
  
  return @{
           @"persistentId": [[NSNumber numberWithUnsignedLongLong:song.persistentID] stringValue],
           @"storeId": song.playbackStoreID == nil ? @"" : song.playbackStoreID,
           @"title": song.title == nil ? @"" : song.title,
           @"thumb": thumbUrl == nil ? @"" : thumbUrl,
           @"duration": @(song.playbackDuration),
           @"artists": artists,
           @"albums": albums,
           };
}

+ (NSArray *)jsonWithSongs:(NSArray<MPMediaItem *> *)songs {
  NSMutableArray *json = [NSMutableArray array];
  for (MPMediaItem *song in songs) {
    [json addObject:[self jsonWithSong:song]];
  }
  return json;
}

+ (NSArray *)jsonWithPlaylists:(NSArray<MPMediaPlaylist *> *)playlists {
  return [self jsonWithPlaylists:playlists includeSong:NO];
}

+ (NSArray *)jsonWithPlaylists:(NSArray<MPMediaPlaylist *> *)playlists includeSong:(BOOL)includeSong {
  NSMutableArray *json = [NSMutableArray array];
  for (MPMediaPlaylist *playlist in playlists) {
    [json addObject:[self jsonWithPlaylist:playlist includeSong:includeSong]];
  }
  return json;
}

@end
