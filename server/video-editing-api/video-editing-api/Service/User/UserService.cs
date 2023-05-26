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
using Microsoft.AspNetCore.Identity;
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

        public async Task<AppUser> GetUserById(Guid id)
        {
            try
            {
                var filter = Builders<AppUser>.Filter.Eq(u => u.Id, id);
                var user = await _user.Find(filter).FirstOrDefaultAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Could not get user by id: {ex.Message}");
            }
        }

        public async Task<AppUser> GetUserByUsername(string username)
        {
            try
            {
                var filter = Builders<AppUser>.Filter.Eq(u => u.UserName, username);
                var user = await _user.Find(filter).FirstOrDefaultAsync();
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Could not get user by username: {ex.Message}");
            }
        }

        public async Task<AppUser> UpdateUserById(Guid id, AppUser updatedUser)
        {
            try
            {
                var filter = Builders<AppUser>.Filter.Eq(u => u.Id, id);

                var update = Builders<AppUser>.Update
                    .Set(u => u.UserName, updatedUser.UserName)
                    .Set(u => u.Email, updatedUser.Email)
                    .Set(u => u.PhoneNumber, updatedUser.PhoneNumber)
                    .Set(u => u.FullName, updatedUser.FullName);

                if (!string.IsNullOrEmpty(updatedUser.PasswordHash))
                {
                    var hasher = new PasswordHasher<AppUser>();

                    // Hash mật khẩu mới bằng PasswordHasher
                    var hashedPassword = hasher.HashPassword(updatedUser, updatedUser.PasswordHash);

                    update = update.Set(u => u.PasswordHash, hashedPassword);
                }

                var options = new FindOneAndUpdateOptions<AppUser>
                {
                    ReturnDocument = ReturnDocument.After
                };

                var user = await _user.FindOneAndUpdateAsync(filter, update, options);
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception($"Could not update user: {ex.Message}");
            }
        }
    }
}
