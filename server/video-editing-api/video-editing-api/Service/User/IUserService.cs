using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Model.InputModel.Youtube;

namespace video_editing_api.Service.User
{
    public interface IUserService
    {
        Task<List<AppUser>> GetAllUser();
        Task<AppUser> GetUserById();
        Task<AppUser> GetUserByUsername(string username);
        Task<AppUser> UpdateUserById();
    }
}
