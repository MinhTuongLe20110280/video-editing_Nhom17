﻿using System.Collections.Generic;

namespace video_editing_api.Model.InputModel
{
    public class InputMergeHL
    {
        public List<EventStorage> Event { get; set; }
        public List<List<string>> Logo { get; set; }
    }
}
