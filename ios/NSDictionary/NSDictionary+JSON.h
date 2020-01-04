//
//  NSDictionary+JSON.h
//  SmoothPay2.0
//
//  Created by Alex on 11/12/15.
//  Copyright (c) 2015 BCL. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface NSDictionary (JSON)

+ (nullable id) jsonFromString:(nullable NSString *)strJson;
+ (nullable id) jsonFromData:(nullable NSData *)data;

- (nullable NSString *) toJsonString;

- (nullable id) optObject:(nonnull NSString *)key;
- (nullable id) getObject:(nonnull NSString *)key default:(nonnull id)defval;
- (nullable NSDictionary *) optJson:(nonnull NSString *)key;

- (nullable NSArray *) optArray:(nonnull NSString *)key;
- (nonnull NSArray *) getArray:(nonnull NSString *)key default:(nonnull NSArray *)defval;
- (nullable NSString *) optString:(nonnull NSString *)key;
- (nonnull NSString *) getString:(nonnull NSString *)key default:(nonnull NSString *)defval;
- (nullable NSNumber *) optNumber:(nonnull NSString *)key;
- (NSInteger) integerFor:(nonnull NSString *)key default:(NSInteger)defval;
- (BOOL) boolFor:(nonnull NSString *)key default:(BOOL)defval;
- (double) doubleFor:(nonnull NSString *)key default:(double)defval;

@end
