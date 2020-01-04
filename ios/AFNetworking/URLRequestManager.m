//
//  URLRequestManager.m
//  iDoser
//
//  Created by Michael Lee on 3/21/17.
//  Copyright © 2017 Michael Lee. All rights reserved.
//

#import "URLRequestManager.h"

@interface URLRequestManager ()

@end

@implementation URLRequestManager

+ (instancetype)sharedInstance {
    static URLRequestManager * instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[URLRequestManager alloc] init];
    });
    return instance;
}

- (instancetype)init {
    if (self = [super init]) {
        self.httpSession = [[AFHTTPSessionManager alloc] init];
        self.httpSession.responseSerializer = [AFHTTPResponseSerializer serializer];
        self.httpSession.responseSerializer.acceptableContentTypes = [self.httpSession.responseSerializer.acceptableContentTypes setByAddingObject:@"text/html"];
        self.httpSession.requestSerializer.cachePolicy = NSURLRequestReloadIgnoringCacheData;
        
        self.jsonSession = [[AFHTTPSessionManager alloc] init];
        self.jsonSession.responseSerializer = [AFJSONResponseSerializer serializer];
        self.jsonSession.responseSerializer.acceptableContentTypes = [self.jsonSession.responseSerializer.acceptableContentTypes setByAddingObject:@"text/html"];
        self.jsonSession.requestSerializer.cachePolicy = NSURLRequestReloadIgnoringCacheData;
    }
    return self;
}

+ (AFHTTPSessionManager *)jsonSession {
    return [[self sharedInstance] jsonSession];
}
+ (AFHTTPSessionManager *)httpSession {
    return [[self sharedInstance] httpSession];
}

+ (NSURLSessionTask *) sendRequest:(AFHTTPSessionManager *)session
                               url:(NSString *)url
                       requestType:(URLRequestType)requestType
                            params:(NSDictionary *)params
                      respondBlock:(URLRequestRespondBlock)respondBlock
                     progressBlock:(URLRequestProgressBlock)progressBlock
                    buildBodyBlock:(URLRequestBuildBodyBlock)buildBodyBlock
{
    NSURLSessionTask * task;
    void (^successBlock) (NSURLSessionDataTask * task, id result) = ^(NSURLSessionDataTask * task, id result) {
        if (respondBlock) {
            respondBlock(task, result, nil);
        }
    };
    void (^failedBlock) (NSURLSessionDataTask * task, NSError * error) = ^(NSURLSessionDataTask * task, NSError * error) {
        if (respondBlock != nil) {
            respondBlock(task, nil, error);
        }
    };
  
    switch (requestType) {
        case RequestGet:
            task = [session GET:url parameters:params progress:progressBlock success:successBlock failure:failedBlock];
            break;
        
        case RequestPost:
            if (buildBodyBlock) {
                task = [session POST:url parameters:params constructingBodyWithBlock:buildBodyBlock progress:progressBlock success:successBlock failure:failedBlock];
            } else {
                task = [session POST:url parameters:params progress:progressBlock success:successBlock failure:failedBlock];
            }
            break;
            
        case RequestDelete:
            task = [session DELETE:url parameters:params success:successBlock failure:failedBlock];
            break;
            
        case RequestPut:
            task = [session PUT:url parameters:params success:successBlock failure:failedBlock];
            break;
            
        case Requesthead:
            task = [session HEAD:url parameters:params success:^(NSURLSessionDataTask * _Nonnull task) {
                successBlock(task, nil);
            } failure:failedBlock];
            break;
    }
  
    return task;
}

@end
