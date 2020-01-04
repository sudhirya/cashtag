//
//  NSDictionary+JSON.m
//  SmoothPay2.0
//
//  Created by Alex on 11/12/15.
//  Copyright (c) 2015 BCL. All rights reserved.
//

#import "NSDictionary+JSON.h"

@implementation NSDictionary (JSON)

+ (nullable id)jsonFromString:(nullable NSString *)strJson {
  NSError * error;
  if (strJson == nil) return nil;
  
  return [NSJSONSerialization JSONObjectWithData:[strJson dataUsingEncoding:NSUTF8StringEncoding] options:0 error:&error];
}

+ (nullable id)jsonFromData:(nullable NSData *)data {
  NSError * error;
  if (data == nil) return nil;
  
  return [NSJSONSerialization JSONObjectWithData:data options:0 error:&error];
}

- (nullable NSString *)toJsonString {
  NSError * error;
  NSData * jsonData = [NSJSONSerialization dataWithJSONObject:self options:0 error:&error];
  
  if (jsonData == nil) return @"";
  
  return [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
}

- (nullable id)optObject:(nonnull NSString *)key {
  return [self valueForKey:key];
}

- (nullable id)getObject:(nonnull NSString *)key default:(nonnull id)defval {
  id jsonObject = [self optObject:key];
  if (jsonObject == nil) return defval;

  return jsonObject;
}

- (NSDictionary *)optJson:(NSString *)key {
  id jsonObject = [self valueForKey:key];
  if (jsonObject == nil) return nil;
  
  if ([jsonObject isKindOfClass:[NSDictionary class]]) {
    return (NSDictionary*) jsonObject;
  }
  if ([jsonObject isKindOfClass:[NSString class]]) {
    NSString* jsonString = (NSString*) jsonObject;
    return [NSDictionary jsonFromString:jsonString];
  }
  return nil;
}

- (nullable NSString *)optString:(nonnull NSString *)key {
  id jsonObject = [self valueForKey:key];
  if (jsonObject == nil) return nil;
  
  if ([jsonObject isKindOfClass:[NSString class]]) {
    return jsonObject;
  } else if ([jsonObject isKindOfClass:[NSNumber class]]) {
    NSNumber * number = (NSNumber *) jsonObject;
    return [number stringValue];
  }
  return nil;
}

- (nonnull NSString *)getString:(nonnull NSString *)key default:(nonnull NSString *)defval {
  id jsonString = [self optString:key];
  if (jsonString == nil) return defval;
  
  return jsonString;
}

- (nullable NSArray *)optArray:(nonnull NSString *)key {
  id jsonObject = [self valueForKey:key];
  if (jsonObject == nil) return nil;
  
  if ([jsonObject isKindOfClass:[NSArray class]]) {
    return jsonObject;
  }
  return nil;
}

- (nonnull NSArray *)getArray:(nonnull NSString *)key default:(nonnull NSArray *)defval {
  id jsonArray = [self optArray:key];
  if (jsonArray == nil) return defval;

  return jsonArray;
}

- (nullable NSNumber *) optNumber:(nonnull NSString *)key {
  id jsonObject = [self valueForKey:key];
  if (jsonObject == nil) return nil;
  
  if ([jsonObject isKindOfClass:[NSNumber class]]) {
    return (NSNumber *)jsonObject;
  } else if ([jsonObject isKindOfClass:[NSString class]]) {
    double val = [((NSString *)jsonObject) doubleValue];
    return [NSNumber numberWithDouble:val];
  }
  return nil;
}

- (NSInteger)integerFor:(nonnull NSString *)key default:(NSInteger)defval {
  id jsonObject = [self valueForKey:key];
  if (jsonObject == nil) return defval;
  
  if ([jsonObject isKindOfClass:[NSNumber class]] || [jsonObject isKindOfClass:[NSString class]]) {
    return [jsonObject integerValue];
  }
  return defval;
}

- (BOOL)boolFor:(nonnull NSString *)key default:(BOOL)defval {
  id jsonObject = [self valueForKey:key];
  if (jsonObject == nil) return defval;
  
  if ([jsonObject isKindOfClass:[NSNumber class]] || [jsonObject isKindOfClass:[NSString class]]) {
    return [jsonObject boolValue];
  }
  return defval;
}

- (double)doubleFor:(nonnull NSString *)key default:(double)defval {
  id jsonObject = [self valueForKey:key];
  if (jsonObject == nil) return defval;
  
  if ([jsonObject isKindOfClass:[NSNumber class]] || [jsonObject isKindOfClass:[NSString class]]) {
    return [jsonObject doubleValue];
  }
  return defval;
}

@end
