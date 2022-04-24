﻿using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using video_editing_api.Model;
using video_editing_api.Model.Collection;
using video_editing_api.Model.InputModel;
using video_editing_api.Service.DBConnection;
using video_editing_api.Service.Storage;
using Xabe.FFmpeg;


namespace video_editing_api.Service.VideoEditing
{
    public class VideoEditingService : IVideoEditingService
    {
        private readonly IMongoCollection<Action> _actions;
        private readonly IMongoCollection<Tournament> _tournament;
        private readonly IMongoCollection<MatchInfo> _matchInfo;
        private readonly IMongoCollection<HighlightVideo> _highlight;

        private readonly IStorageService _storageService;
        private readonly Cloudinary _cloudinary;
        private readonly IWebHostEnvironment _env;


        private string _dir;
        public VideoEditingService(IDbClient dbClient, IConfiguration config, IStorageService storageService, IWebHostEnvironment env)
        {
            _actions = dbClient.GetActionCollection();
            _tournament = dbClient.GetTournamentCollection();
            _matchInfo = dbClient.GetMatchInfoCollection();
            _highlight = dbClient.GetHighlightVideoCollection();
            _dir = env.WebRootPath;
            _storageService = storageService;

            _env = env;
            var account = new Account(
               config["Cloudinary:CloudName"],
               config["Cloudinary:ApiKey"],
               config["Cloudinary:ApiSecret"]
               );

            _cloudinary = new Cloudinary(account);
        }

        #region Action
        public async Task<List<Action>> GetActions()
        {
            try
            {
                return await _actions.Find(action => true).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<string> AddAction(List<Action> actions)
        {
            try
            {
                await _actions.InsertManyAsync(actions);
                return "Succeed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        #endregion


        #region Tournament
        public async Task<Tournament> GetTournament(string id)
        {
            try
            {
                return await _tournament.Find(tournament => tournament.Id == id).FirstOrDefaultAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<List<Tournament>> GetTournament()
        {
            try
            {
                return await _tournament.Find(tournament => true).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<string> AddTournament(List<Tournament> tournaments)
        {
            try
            {
                await _tournament.InsertManyAsync(tournaments);
                return "Succeed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        #endregion



        #region MatchInfo
        public async Task<MatchInfo> GetMatchInfo(string id)
        {
            try
            {
                var res = (from m in _matchInfo.AsQueryable()
                           join t in _tournament.AsQueryable() on m.TournamentId equals t.Id
                           where m.Id == id
                           select new MatchInfo
                           {
                               Id = m.Id,
                               TournamentId = m.TournamentId,
                               Channel = m.Channel,
                               Ip = m.Ip,
                               MactchTime = m.MactchTime,
                               MatchName = m.MatchName,
                               Port = m.Port,
                               TournametName = t.Name,
                               //IsUploadJsonFile=m.IsUploadJsonFile,
                               JsonFile = m.JsonFile,
                               //Videos = m.Videos,
                           }).FirstOrDefault();
                return res;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<List<MatchInfo>> GetMatchInfo()
        {
            try
            {
                var res = (from m in _matchInfo.AsQueryable()
                           join t in _tournament.AsQueryable() on m.TournamentId equals t.Id
                           select new MatchInfo
                           {
                               Id = m.Id,
                               TournamentId = m.TournamentId,
                               Channel = m.Channel,
                               Ip = m.Ip,
                               MactchTime = m.MactchTime,
                               MatchName = m.MatchName,
                               Port = m.Port,
                               TournametName = t.Name,
                               IsUploadJsonFile = m.IsUploadJsonFile,
                               //Videos = m.Videos,
                           }).ToList();

                return res;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        public async Task<string> AddMatchInfo(MatchInfo matchInfo)
        {
            try
            {
                await _matchInfo.InsertOneAsync(matchInfo);
                return "Succeed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public async Task<bool> DeleteMatch(string id)
        {
            try
            {
                await _matchInfo.DeleteOneAsync(match => match.Id == id);
                return true;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }
        #endregion




        public async Task<string> UploadVideoForMatch(string Id, IFormFile file)
        {
            try
            {
                var match = _matchInfo.Find(x => x.Id == Id).First();
                var tournament = _tournament.Find(x => x.Id == match.TournamentId).First();

                string folderName = $"{tournament.Name}_{match.MatchName}_{match.MactchTime.ToString("dd-MM-yyyy-HH-mm")}";
                string publicId = System.Guid.NewGuid().ToString();
                string fileName = file.FileName;
                string type = fileName.Substring(fileName.LastIndexOf("."));

                string path = await _storageService.SaveFile(folderName, $"{publicId}{type}", file);
                VideoResource vr = new VideoResource()
                {
                    PublicId = publicId,
                    Name = fileName.Substring(0, fileName.LastIndexOf(".")),
                    Url = path,
                    Duration = await getDuration(path)
                };
                //match.Videos.Add(vr);
                _matchInfo.ReplaceOne(m => m.Id == Id, match);
                return "Succed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        public string UploadVideo(string Id, IFormFile file)
        {

            try
            {
                var match = _matchInfo.Find(x => x.Id == Id).First();
                var tournament = _tournament.Find(x => x.Id == match.TournamentId).First();

                string tournamentName = tournament.Name;
                string matchName = match.MatchName;
                string matchTime = match.MactchTime.ToString("dd-MM-yyyy-HH-mm");

                //match.Videos.Add(UploadVideoForMatch(file, tournamentName, matchName, matchTime));

                _matchInfo.ReplaceOne(m => m.Id == Id, match);
                return "Succed";
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }


        private VideoResource UploadVideoForMatch(IFormFile file, string tournamentName, string matchName, string matchTime)
        {
            try
            {
                var videoresource = new VideoResource();
                using var stream = file.OpenReadStream();
                var name = System.Guid.NewGuid();
                var param = new VideoUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                    Transformation = new Transformation().Crop("fill"),
                    PublicId = $"VideoEditing/{tournamentName}/{matchName}-{matchTime}/{name}"
                };
                var uploadResult = _cloudinary.Upload(param);

                if (uploadResult.Error == null)
                {
                    videoresource.PublicId = uploadResult.PublicId;
                    videoresource.Duration = uploadResult.Duration;
                    videoresource.Name = "";
                    videoresource.Url = uploadResult.SecureUrl.ToString();
                }
                else
                {
                    throw new System.Exception(uploadResult.Error.Message);
                }
                return videoresource;
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }


        public async Task<List<HighlightVideo>> GetHighlightVideos()
        {
            try
            {
                return await _highlight.Find(highligth => true).ToListAsync();
            }
            catch (System.Exception e)
            {
                throw new System.Exception(e.Message);
            }
        }

        //public async Task<string> ConcatVideoOfMatch(string matchId, List<TrimVideoHightlightModel> models)
        //{
        //    try
        //    {
        //        string response = string.Empty;
        //        var match = _matchInfo.Find(x => x.Id == matchId).First();
        //        if (models.Count > 0)
        //        {
        //            var trans = new Transformation().EndOffset(models[0].EndTime).StartOffset(models[0].StartTime);

        //            for (int i = 1; i < models.Count; i++)
        //            {
        //                trans.Chain().Flags("splice").Overlay(new Layer().PublicId($"video:{models[i].PublicId}")).EndOffset(models[i].EndTime).StartOffset(models[i].StartTime).Chain();
        //            }

        //            var fitstVideo = match.Videos.Where(x => x.PublicId == models[0].PublicId).FirstOrDefault();
        //            if (fitstVideo != null)
        //            {
        //                var name = System.Guid.NewGuid();
        //                var param = new VideoUploadParams
        //                {
        //                    File = new FileDescription(fitstVideo.Url),
        //                    Transformation = models.Count > 1 ? trans.Chain().Flags("layer_apply") : trans,
        //                    PublicId = $"VideoEditing/Highlight/{match.MatchName}-{match.MactchTime.ToString("dd-MM-yyyy-HH-mm")}/{name}"
        //                };
        //                var uploadResult = await _cloudinary.UploadAsync(param);
        //                if (uploadResult.Error == null)
        //                {
        //                    var highlight = new HighlightVideo()
        //                    {
        //                        MatchId = match.Id,
        //                        MatchInfo = $"({match.MatchName})T({match.MactchTime.ToString("dd-MM-yyyy-hh-mm")})",
        //                        Duration = uploadResult.Duration,
        //                        PublicId = uploadResult.PublicId,
        //                        Url = uploadResult.SecureUrl.ToString()
        //                    };
        //                    await _highlight.InsertOneAsync(highlight);
        //                    response = highlight.Url;
        //                }
        //                else
        //                {
        //                    throw new System.Exception(uploadResult.Error.Message);
        //                }
        //            }
        //            else
        //            {
        //                throw new System.Exception("No video in storage video of match!");
        //            }
        //        }
        //        else
        //        {
        //            throw new System.Exception("No video to concat");
        //        }
        //        return response;
        //    }
        //    catch (System.Exception e)
        //    {
        //        throw new System.Exception(e.Message);
        //    }
        //}




        //public async Task<bool> Up()
        //{
        //    try
        //    {
        //        //await _storageService.SaveFile("test", "test.mp4", file);
        //        //await Trim();
        //        //await Concat();
        //        //await test();
        //        return true;
        //    }
        //    catch (System.Exception ex)
        //    {
        //        throw new System.Exception(ex.Message);
        //    }
        //}


        public async Task<bool> Trim()
        {
            try
            {
                var input = Path.Combine(_dir, "test\\test.mp4");
                var output = Path.Combine(_dir, "converted.mp4");
                //var ffmpeg = FFmpeg.

                FFmpeg.SetExecutablesPath(Path.Combine(_dir, "ffmpeg"));
                // Resource
                var info = await FFmpeg.GetMediaInfo(input);
                var a = info.Duration;

                var videoStream = info.VideoStreams.First().SetCodec(Xabe.FFmpeg.VideoCodec.h264).SetSize(VideoSize.Hd480).Split(System.TimeSpan.FromSeconds(30), System.TimeSpan.FromSeconds(10));
                IStream audioStream = info.AudioStreams.FirstOrDefault()?.SetCodec(AudioCodec.aac);
                await FFmpeg.Conversions.New()
                    .AddStream(videoStream, audioStream)
                    .SetOutput(output)
                    .Start();
                //MediaInfo.Get(input);
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        public async Task<bool> Concat()
        {
            try
            {
                var input = Path.Combine(_dir, "test\\test.mp4");
                var output = Path.Combine(_dir, "converted.mp4");
                var output1 = Path.Combine(_dir, "converted1.mp4");

                FFmpeg.SetExecutablesPath(Path.Combine(_dir, "ffmpeg"));

                string[] arr = { input, output };

                var conversion = await FFmpeg.Conversions.FromSnippet.Concatenate(output1, arr);
                await conversion.Start();
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        public async Task<bool> Up(string matchId, List<TrimVideoHightlightModel> models)
        {
            try
            {
                //List<string> path = new List<string>();
                //var match = _matchInfo.Find(x => x.Id == matchId).First();

                ////string outputName = 

                //StringBuilder arguments = new StringBuilder();
                //StringBuilder temp = new StringBuilder();
                //StringBuilder inputVideo = new StringBuilder();
                //StringBuilder trimInfo = new StringBuilder();


                //for (int i = 0; i < models.Count; i++)
                //{

                //    path.Add(match.Videos.Where(video => video.PublicId == models[i].PublicId).First().Url);
                //    temp.Append($"[v{i}][a{i}]");
                //    trimInfo.Append($"[{i}:v]trim=start={models[i].StartTime}:end={models[i].EndTime},setpts=PTS-STARTPTS[v{i}];[{i}:a]atrim=start={models[i].StartTime}:end={models[i].EndTime},asetpts=PTS-STARTPTS[a{i}];");

                //}
                //foreach (var item in path)
                //{
                //    inputVideo.Append($"-i {Path.Combine(_dir, item.Replace("/", "\\"))} ");
                //}

                //arguments.Append("-y ");
                //arguments.Append(inputVideo.ToString());
                //arguments.Append("-filter_complex \"");
                //arguments.Append(trimInfo.ToString());

                //arguments.Append($"{temp.ToString()}concat=n={path.Count}:v=1:a=1[v][a]\" -map \"[v]\" -map \"[a]\" output.mp4");


                //var arg = $"-y -i {Path.Combine(_dir, "C1_Tota-Vis_09-01-2022-18-04/c5abe37c-4773-4aa6-97e2-31efe226b86d.mp4")} -i {Path.Combine(_dir, "C1_Tota-Vis_09-01-2022-18-04/b748e801-cce3-4457-830a-c2c0798e3936.mp4")} -filter_complex \"[0:v]trim=start=60:end=180,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=60:end=180,asetpts=PTS-STARTPTS[a0];[1:v]trim=start=60:end=120,setpts=PTS-STARTPTS[v1];[1:a]atrim=start=60:end=120,asetpts=PTS-STARTPTS[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]\" -map \"[v]\" -map \"[a]\" output.mp4";

                var a = "-y -i http://118.69.218.59:5050/projects/625925c9b9e572905bcba1c9/raw/video -i http://118.69.218.59:5050/projects/625925ce85ea1d1c82f86ffa/raw/video -filter_complex \"[0:v]trim=start=10:end=20,setpts=PTS-STARTPTS[v0];[0:a]atrim=start=10:end=20,asetpts=PTS-STARTPTS[a0];[1:v]trim=start=10:end=30,setpts=PTS-STARTPTS[v1];[1:a]atrim=start=10:end=30,asetpts=PTS-STARTPTS[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]\" -map \"[v]\" -map \"[a]\" output1234.mp4";

                await Task.Run(() =>
                {
                    string path = Path.Combine(_env.ContentRootPath, "ffmpeg", "ffmpeg.exe");
                    var startInfo = new ProcessStartInfo()
                    {
                        FileName = Path.Combine(_env.ContentRootPath, "ffmpeg", "ffmpeg.exe"),
                        //Arguments = arguments.ToString(),
                        Arguments = a,
                        WorkingDirectory = Path.Combine(_dir, "Highlight"),
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    using (var process = new Process { StartInfo = startInfo })
                    {
                        process.Start();
                        process.WaitForExit();
                    }
                });
                return true;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }


        private async Task<double> getDuration(string path)
        {
            try
            {
                path = path.Replace("/", "\\");
                var input = Path.Combine(_dir, path);
                FFmpeg.SetExecutablesPath(Path.Combine(_dir, "ffmpeg"));
                var info = await FFmpeg.GetMediaInfo(input);
                return info.Duration.TotalSeconds;
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<string> ConcatVideoOfMatch(string matchId, InputSendServer file)
        {

            try
            {
                var match = _matchInfo.Find(x => x.Id == matchId).First();

                HttpClient client = new HttpClient();
                client.BaseAddress = new System.Uri("http://118.69.218.59:7007");
                var json = JsonConvert.SerializeObject(file);
                json = json.Replace("E", "e");
                var httpContent = new StringContent(json, Encoding.UTF8, "application/json");
                var response = await client.PostAsync("/highlight", httpContent);
                var result = await response.Content.ReadAsStringAsync();

                ConcatResultModel model = JsonConvert.DeserializeObject<ConcatResultModel>(result);

                HighlightVideo hl = new HighlightVideo()
                {
                    MatchId = matchId,
                    mp4 = model.mp4,
                    ts = model.ts,
                    MatchInfo = $"({match.MatchName})T({match.MactchTime.ToString("dd-MM-yyyy-hh-mm")})"
                };
                await _highlight.InsertOneAsync(hl);
                return "Succeed";
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }

        public async Task<string> UploadJson(string matchId, IFormFile jsonfile)
        {
            try
            {
                string textJson = string.Empty;
                using (var reader = new StreamReader(jsonfile.OpenReadStream()))
                {
                    textJson = await reader.ReadToEndAsync();
                }
                InputSendServer input = JsonConvert.DeserializeObject<InputSendServer>(textJson);
                var match = _matchInfo.Find(x => x.Id == matchId).First();
                match.IsUploadJsonFile = true;
                match.JsonFile = input;
                _matchInfo.ReplaceOne(m => m.Id == matchId, match);
                return "Succeed";
            }
            catch (System.Exception ex)
            {
                throw new System.Exception(ex.Message);
            }
        }
    }
}
