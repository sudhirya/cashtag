//
//  AppleMusicModel.h
//  ChilllApp
//
//  Created by Michael Lee on 4/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <MediaPlayer/MediaPlayer.h>

typedef enum AppleMusicMediaType: NSUInteger {
  AppleMusicMediaTypeUnknown,
  AppleMusicMediaTypeSongs,
  AppleMusicMediaTypeAlbums,
  AppleMusicMediaTypeStations,
  AppleMusicMediaTypePlaylists
} AppleMusicMediaType;

@interface AppleMusicModelBase: NSObject
@property (nonatomic, assign) bool valid;
@end

@interface AppleMusicArtwork : AppleMusicModelBase

@property (nonatomic, assign) NSInteger width;
@property (nonatomic, assign) NSInteger height;
@property (nonatomic, retain) NSString* urlTemplateString;

- (instancetype) initWithJson:(NSDictionary*)json;
- (NSURL*) imageURL:(CGSize)size;

@end

@interface AppleMusicMediaItem: AppleMusicModelBase

@property (nonatomic, retain) NSString* identifier;
@property (nonatomic, retain) NSString* name;
@property (nonatomic, retain) NSString* artistName;
@property (nonatomic, retain) AppleMusicArtwork* artwork;
@property (nonatomic, assign) AppleMusicMediaType type;

- (instancetype) initWithJson:(NSDictionary*)json;

@end

@interface AppleMusicExportItem: NSObject

@property (nonatomic, assign, readonly) NSString *persistentId;
@property (nonatomic, retain, readonly) NSString *title;
@property (nonatomic, retain, readonly) NSString *artist;
@property (nonatomic, retain, readonly) NSString *composer;
@property (nonatomic, retain, readonly) NSString *thumb;
@property (nonatomic, retain, readonly) NSString *storeId;

- (instancetype)initWithMediaItem:(MPMediaItem *)item;

@end

@interface AppleMusicModel: NSObject

+ (NSDictionary *)jsonWithPlaylist:(MPMediaPlaylist *)playlist;
+ (NSDictionary *)jsonWithPlaylist:(MPMediaPlaylist *)playlist includeSong:(BOOL)includeSong;
+ (NSDictionary *)jsonWithSong:(MPMediaItem *)song;
+ (NSArray *)jsonWithSongs:(NSArray<MPMediaItem *> *)songs;
+ (NSArray *)jsonWithPlaylists:(NSArray<MPMediaPlaylist *> *)playlists;
+ (NSArray *)jsonWithPlaylists:(NSArray<MPMediaPlaylist *> *)playlists includeSong:(BOOL)includeSong;

@end
