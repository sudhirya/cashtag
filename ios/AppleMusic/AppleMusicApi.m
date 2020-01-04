//
//  AppleMusicApi.m
//  ChilllApp
//
//  Created by Michael Lee on 4/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "AppleMusicApi.h"
#import "URLRequestManager.h"
#import "NSDictionary+JSON.h"

/// The base URL for all Apple Music API network calls.
NSString* const mAppleMusicAPIBaseURLString = @"https://api.music.apple.com";

@implementation AppleMusicApi

+ (NSString *)urlFromPath:(NSString *)path {
  if (path == nil || path.length == 0) {
    return mAppleMusicAPIBaseURLString;
  }
  if ([path rangeOfString:@"/"].length == 0) {
    return [NSString stringWithFormat:@"%@%@", mAppleMusicAPIBaseURLString, path];
  }
  return [NSString stringWithFormat:@"%@/%@", mAppleMusicAPIBaseURLString, path];
}

+ (NSString *)storefrontsUrl:(NSString *)regionCode {
  NSString * path = [NSString stringWithFormat:@"/v1/storefronts/%@", regionCode];
  return [self urlFromPath:path];
}

+ (void)setupAuthorization:(AFHTTPSessionManager *)session developerToken:(NSString *)developerToken {
  NSString *bearerToken = [NSString stringWithFormat:@"Bearer %@", developerToken];
  [session.requestSerializer setValue:bearerToken forHTTPHeaderField:@"Authorization"];
}

+ (void)setupAuthorization:(AFHTTPSessionManager *)session developerToken:(NSString *)developerToken userToken:(NSString *)userToken {
  NSString *bearerToken = [NSString stringWithFormat:@"Bearer %@", developerToken];
  [session.requestSerializer setValue:bearerToken forHTTPHeaderField:@"Authorization"];
  [session.requestSerializer setValue:userToken forHTTPHeaderField:@"Music-User-Token"];
}

+ (void)requestStorefrontWithRegionCode:(NSString *)regionCode developerToken:(NSString *)developerToken completion:(void (^)(NSString *identifier))completion {
  AFHTTPSessionManager *session = [URLRequestManager jsonSession];
  NSString *url = [self storefrontsUrl:regionCode];
  
  [self setupAuthorization:session developerToken:developerToken];
  [URLRequestManager sendRequest:session url:url requestType:RequestGet params:nil respondBlock:^(NSURLSessionTask *task, id respond, NSError *error) {
    completion([self parseStoreFront:respond]);
  } progressBlock:nil buildBodyBlock:nil];
}

+ (void)requestUserStorefrontWithUserToken:(NSString *)userToken developerToken:(NSString *)developerToken completion:(void (^)(NSString *identifier))completion {
  AFHTTPSessionManager *session = [URLRequestManager jsonSession];
  NSString *url = [self urlFromPath:@"/v1/me/storefront"];
  
  [self setupAuthorization:session developerToken:developerToken userToken:userToken];
  [URLRequestManager sendRequest:session url:url requestType:RequestGet params:nil respondBlock:^(NSURLSessionTask *task, id respond, NSError *error) {
    completion([self parseStoreFront:respond]);
  } progressBlock:nil buildBodyBlock:nil];
}

+ (BOOL)isJsonObject:(id)json {
  return json != nil && [json isKindOfClass:[NSDictionary class]];
}

+ (NSString *)parseStoreFront:(id)json {
  if (![self isJsonObject:json]) return nil;
  
  NSArray *arrData = [json optArray:@"data"];
  if (arrData == nil || arrData.count == 0) return nil;
  
  NSDictionary *jsonData = [arrData firstObject];
  if (![self isJsonObject:jsonData]) return nil;
  
  return [jsonData optString:@"id"];
}

@end
