//
//  AppleMusicApi.h
//  ChilllApp
//
//  Created by Michael Lee on 4/21/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface AppleMusicApi : NSObject

+ (void)requestStorefrontWithRegionCode:(NSString *)regionCode developerToken:(NSString *)developerToken completion:(void (^)(NSString *identifier))completion;
+ (void)requestUserStorefrontWithUserToken:(NSString *)userToken developerToken:(NSString *)developerToken completion:(void (^)(NSString *identifier))completion;

@end
