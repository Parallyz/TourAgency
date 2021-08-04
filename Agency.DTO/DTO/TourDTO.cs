﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Agency.DTO


{

    public class TourDTO
    {
       
        public string Id { get; set; }

        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string Name { get; set; }

        public ICollection<string> Towns { get; set; }
       
        public string MainImage { get; set; }


        public int Grade { get; set; }

        public float CostinDoldars { get; set; }


    }
}
