using AutoMapper;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Services;
using Google.Apis.Upload;
using Google.Apis.YouTube.v3;
using Google.Apis.YouTube.v3.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Model.InputModel.Youtube;
using video_editing_api.Service.DBConnection;

namespace video_editing_api.Service.User
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<AppUser> _user;

        public UserService(IDbClient dbClient, IMongoCollection<AppUser> user)
        {
            _user = dbClient.GetUserCollection();
        }

        public async Task<List<AppUser>> GetAllUser()
        {
            try
            {
                var users = await _user.Find(user => true).ToListAsync();
                return users;
            }
            catch (Exception ex)
            {
                throw new Exception($"Could not get all users: {ex.Message}");
            }
        }

        public Task<AppUser> GetUserById()
        {
            throw new System.NotImplementedException();
        }

        public Task<AppUser> GetUserByUsername()
        {
            throw new System.NotImplementedException();
        }

        public Task<AppUser> UpdateUserById()
        {
            throw new System.NotImplementedException();
        }
    }
}
