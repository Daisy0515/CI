<template>
  <el-card >
    <div slot="header">
      <el-row type="flex" justify="space-between">
        <el-col :span="10">
          code Graph Fullscreen
        </el-col>
        <el-col :span="1">
          <i class="el-icon-close" @click="closeFullscreen"></i>
        </el-col>
      </el-row>
    </div>
    <div id="fullDiv" style="width: 100%;height: 100%">
      <svg id="fullSvg" class="fullSvg"></svg>
    </div>
  </el-card>
</template>

<script>
import * as d3 from "d3";

export default {
name: "fullScreen",
  mounted() {
    console.log("fullScreen mouted");
    this.$emit("getData");
  },
  data:function (){
    return {
      d3node:[
        {type:"Class",name : "helloworld",group:1,id:1},
        {type:"Method",name : "hjsdkchskjhdfv",group:0,id:2},
        {type:"Method",name : "helloworld",group:1,id:3}
      ],
      d3Edge:[
        {sourceId:3,targetId:1,value:1,relation:"sjdsgjdf"},
        {sourceId: 2,targetId: 1,value:1,relation:"s"}
      ],
      simulation:null,
      svg_links:null,
      svg_nodes:null,
      svg_text:null,
      gs:null,
      initFlag:false,
    }
  },
  methods:{
    closeFullscreen:function (){
      this.$emit("closeFullscreen");
    },
    show:function (node,edge){
      console.log("full screen show");
      var width = document.getElementById("fullDiv").offsetWidth-5;
      var height = document.getElementById("fullDiv").offsetHeight -5;
      var svg = document.getElementById("fullSvg");
      svg.setAttribute("width",width);
      svg.setAttribute("height",height);

      this.d3node = node;
      this.d3Edge = edge;
      this.init();
    },
    init:function (){
      var svg = d3.select("svg.fullSvg");
      console.log(svg);
      svg.selectAll("g").remove();
      var width = svg.attr("width");
      var height = svg.attr("height");
      console.log(width,height);
      var marge = {top:20,bottom:10,left:20,right:10}

      var g = svg.append("g")
          .attr("transform","translate("+marge.top+","+marge.left+")");

      var links = this.d3Edge;
      var nodes = this.d3node;

      //设置class和Method不同的颜色
      var colors =["#63B8FF","#7FFFD4","#FFA500"];

      links.forEach(function (e){
        var sourceNode = nodes.filter(function (n){
          return n.id == e.sourceId;
        })[0];
        var targetNode = nodes.filter(function (n){
          return n.id == e.targetId;
        })[0];
        e.source = sourceNode;
        e.target = targetNode;
      });

      if(!this.initFlag){
        this.simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links))
            .force("charge",d3.forceManyBody().strength(-20))
            .force("center",d3.forceCenter())
            .force('collide',d3.forceCollide().radius(60).iterations(2));
        this.initFlag = true;
      }
      else{
        d3.forceSimulation(nodes);
      }

      //生成数据
      this.simulation.nodes(nodes).on("tick",this.ticked);

      this.simulation.force("link").links(links)
          .distance(function (d){return 150});

      this.simulation.force("center").x(width/2).y(height/2);

      this.d3Edge = links;
      this.d3node = nodes;

      console.log(links);

      //设置箭头的样式
      var arrowMarker = g.append("marker")
          .attr("id","arrow")
          .attr("markerUnits","strokeWidth")
          .attr("markerWidth",30)
          .attr("markerHeight",25)
          .attr("viewBox","-30 -5 30 25")
          .attr("refX",0)
          .attr("refY",0)
          .attr("orient","auto")
          .attr("stroke-width",1)
          .append("path")
          .attr("d","M-24,-5L-14,0L-24,5")
          .attr("fill",'black');

      this.svg_links = g.append('g').selectAll("path")
          .data(links)
          .enter()
          .append("path")
          .style("stroke","black")
          .style("stroke-width",2)
          .attr("marker-end","url(#arrow)");


      this.svg_text = g.append("g").selectAll("text")
          .data(links)
          .enter()
          .append("text")
          .style("fill","#000")
          .attr("domination-baseline","middle")
          .attr("text-anchor","middle")
          .text(function (d){return d.type;})

      this.gs = g.selectAll(".circleText")
          .data(nodes)
          .enter()
          .append("g")
          .attr("transform",function (d,i){
            var cirX = d.x;
            var cirY = d.y;
            return "translate("+cirX + "," + cirY+")";
          })
          .call(d3.drag().on("start",this.start)
              .on("drag",this.dragged)
              .on("end",this.end));

      this.gs.append("circle").attr("r",function (d,i){
        return 30;
      }).attr("fill",function (d){
        if(d.type == "Class")
          return colors[0];
        else if(d.type == "Interface")
          return colors[1];
        else
          return colors[2];
      })
          .attr("stroke",function (d){
            if(d.selected == 0) return null;
            else  {
              return "black"
            }
          })
          .attr("stroke-width",2)
          .on("click",this.clickNode);

      this.gs.append("text").attr("x",-25)
          .attr("y",-5)
          .attr("font-size",13)
          .attr("stroke","black")
          .text(function(d){
            return d.type;
          });
      this.gs.append("text").attr("x",-25)
          .attr("y",15)
          .attr("font-size",10)
          // .attr("dy",40)
          .text(function(d){
            var str = d.name;
            var len = str.length;
            if(len > 10){
              str = str.slice(0,7);
              str += "...";
            }
            return str;
          });

      if(this.initFlag){
        this.simulation.restart();
      }
      // this.simulation.restart();

    },

    start:function (d){
      if(!d3.event.active){
        this.simulation.alphaTarget(0.8).restart();//设置衰减系数，对节点位置移动过程的模拟，数值越高移动越快，数值范围[0，1]
      }
      d.fx = d.x;
      d.fy = d.y;
    },
    dragged:function (d){
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    },
    end:function (d){
      if(!d3.event.active){
        this.simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    },
    ticked:function (){
      // this.svg_links
      //   .attr("x1",function(d){return d.source.x;})
      //   .attr("y1",function(d){return d.source.y;})
      //   .attr("x2",function(d){return d.target.x;})
      //   .attr("y2",function(d){return d.target.y;});
      this.svg_links.attr("d",function (d){return "M " + d.source.x + " " + d.source.y + " L " + d.target.x + " " + d.target.y});

      this.svg_text
          .attr("x",function(d){
            return (d.source.x+d.target.x)/2;
          })
          .attr("y",function(d){
            return (d.source.y+d.target.y)/2;
          }).attr("dy",-5)
          .attr("transform",function (d){
            var angle = Math.atan((d.target.y-d.source.y)/(d.target.x-d.source.x)) / Math.PI * 180;
            return "rotate(" + angle  + "," + (d.source.x+d.target.x)/2+ ","+ (d.source.y+d.target.y)/2+ ")";
          });

      this.gs
          .attr("transform",function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }
  }
}
</script>

<style scoped>
>>>.el-card__body{
  height: 100%;
}
</style>