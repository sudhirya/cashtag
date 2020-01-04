//
//  URLRequestManager.h
//  iDoser
//
//  Created by Michael Lee on 3/21/17.
//  Copyright © 2017 Michael Lee. All rights reserved.
//

#import "AFNetworking.h"

typedef NS_ENUM(NSUInteger, URLRequestType) {
    RequestGet,
    RequestPost,
    Requesthead,
    RequestPut,
    RequestDelete
};

typedef void (^URLRequestRespondBlock) (NSURLSessionTask * task, id respond, NSError * error);
typedef void (^URLRequestBuildBodyBlock) (id body);
typedef void (^URLRequestProgressBlock) (NSProgress * progress);

@interface URLRequestManager : NSObject

@property (nonatomic, retain) AFHTTPSessionManager * httpSession;
@property (nonatomic, retain) AFHTTPSessionManager * jsonSession;
@property (nonatomic, retain) AFHTTPSessionManager * imageSession;

+ (instancetype)sharedInstance;
+ (AFHTTPSessionManager *)jsonSession;
+ (AFHTTPSessionManager *)httpSession;

+ (NSURLSessionTask *)sendRequest:(AFHTTPSessionManager *)session
                              url:(NSString *)url
                      requestType:(URLRequestType)requestType
                           params:(NSDictionary *)params
                     respondBlock:(URLRequestRespondBlock)respondBlock
                    progressBlock:(URLRequestProgressBlock)progressBlock
                   buildBodyBlock:(URLRequestBuildBodyBlock)buildBodyBlock;

@end
