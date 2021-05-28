<template>
  <div id="graphDiv">
<!--    <el-button @click="test">test</el-button>-->
<!--    <el-button @click="addNode">add</el-button>-->
<!--    <el-button @click="copy">copy</el-button>-->
    <br>
    <svg id="graphSvg"></svg>

    <fullScreen class="fullScreen" v-if="fullScreenVisible" @closeFullscreen="closeFullscreen" @getData="getData" ref="fullScreenRef"></fullScreen>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from "axios";
import fullScreen from "./fullScreen";
export default {
  name: "graph",
  props:{
    HOST:{
      type:String,
      required:true
    }
  },
  components:{
    fullScreen
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
      fullScreenVisible:false

    }
  },
  methods:{
    getGraph:async function (code,projectName){
      var _this = this;
      const HOST = this.HOST;
      var width = document.getElementById("graphDiv").offsetWidth-5;
      var height = document.getElementById("graphDiv").offsetHeight -5;
      var svg = document.getElementById("graphSvg");
      svg.setAttribute("width",width);
      svg.setAttribute("height",height);
      // console.log(document.getElementById("graphDiv").offsetWidth);
      await axios.get(`${HOST}/search?code=${code}&projectId=${projectName}`)
        .then(function (response){
          console.log(response);
          console.log(response.data);
          // this.message = response.data;
          var vertex = response.data["vertexs"];
          var edge = response.data.edges;
          _this.d3node = vertex;
          _this.d3Edge = edge;
          _this.solve();
          _this.init();
          console.log("getGraph finish");
        })
        .catch(function (err){})
    },
    solve:function (){
      this.d3node.forEach(function (n){
        n["selected"] = 0;
      })
    },

    init:function (){
      var svg = d3.select("svg");
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
        d3.forceSimulation(nodes)
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
    },
    clickNode:function (node){
      console.log("click",node);
      var index = node.index;
      var len = this.d3node.length;
      for(var i = 0; i < len;i++){
        if(i == index)
          this.d3node[i].selected = 1;
        else
          this.d3node[i].selected = 0;
      }

      this.init();
      // this.hideNode(node.id);

      this.$emit("Information",node.id);
    },
    test:function (){
      this.solve();
      this.init()
    },
    // addNode:function (){
    //   const vertex = {name:"c",methodName : "helloworld",group:1,selected:0,id:87};
    //   var rel = {sourceId: 87,targetId: 1,value:1,relation:"s"};
    //   this.d3node.push(vertex);
    //   this.d3Edge.push(rel);
    //   // this.simulation.nodes(this.d3node);
    //   this.init();
    // },
    hideNode:function (id){
      var len = this.d3node.length;
      var i=0;
      for(i = 0; i < len;i++){
        if(this.d3node[i].id == id){
          this.d3node.splice(i,1);
          break;
        }
      }
      len = this.d3Edge.length;
      for(i = 0; i < len;i++){
        var edge = this.d3Edge[i];
        if(edge.sourceId == id || edge.targetId == id){
          this.d3Edge.splice(i,1);
          i--;
          len--;
        }
      }
      this.init();
      this.$emit("Information",-1);
    },

    extendType:async function (classId,typeName){
      console.log("graph extendType:",classId,typeName);
      var _this = this;
      await axios.get('http://localhost:8088/getExtendType?id='+classId + '&typeName=' + typeName)
        .then(function (response){
          console.log(response);
          console.log(response.data);
          // this.message = response.data;
          var vertex = response.data["vertexs"];
          var edge = response.data.edges;
          var i = 0;
          for(i =0;i<vertex.length;i++)
            _this.d3node.push(vertex[i]);
          for(i = 0 ; i < edge.length;i++)
            _this.d3Edge.push(edge[i]);

          console.log("extend finish");
        })
        .catch(function (err){})
        _this.solve();
      _this.init();
        // _this.simulation.restart();

    },

    //fullScreen
    showFullScreen(){
      this.fullScreenVisible=true;

    },
    closeFullscreen(){
      this.fullScreenVisible=false;
    },
    getData(){
      console.log(this.$refs);
      this.$refs.fullScreenRef.show(this.d3node,this.d3Edge);
    }


  }
}
</script>

<style scoped>
>>>.el-dialog__wrapper{
  position: fixed;
  top:0;
  right:0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  z-index: 0;
}

>>>.el-dialog{
  position: relative;
  margin: 0;
  background: #FFFFFF;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgb(0 0 0);
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  z-index: 0;
  margin-top: 0;
}

.fullScreen{
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}
</style>
