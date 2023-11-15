
import {get,set, ref ,push} from "firebase/database";
import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import * as d3 from 'd3';
import { db , auth} from "../firebase";

const ProgressScreen = ({ navigation }) => {
  // Sample data for the D3 bar chart
  //const data = [20, 30, 20, 50,40,50,70];
  //const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const user = auth.currentUser;
  const userSurveyRef = ref(db, `DataToPlot/${user.uid}`);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(userSurveyRef);
        if (snapshot.exists()) {
          const dataFromFirebase = snapshot.val();
          setData(dataFromFirebase.qualityOfSleep || '');
          setData2(dataFromFirebase.rpe || '');
          setData3(dataFromFirebase.painScale || '');
          setData4(dataFromFirebase.mentalhealthscale || '');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user) {
      fetchData(); // Invoke the async function immediately
    }
  }, [user]);

  useEffect(() => {
    if (data.length>0){
    // Set up the SVG canvas dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    //const height = 300 - margin.top - margin.bottom;
    //const barWidth = width / data.length;

    // Example usage:
    const plannedWorkInMinutes = 120; // replace with your planned work duration in minutes
    const completedWork = 90; // replace with your completed work value
    const heartRate = 70; // replace with your heart rate value

    const acwrCalculator = new ACWRCalculator(plannedWorkInMinutes, completedWork, heartRate);
    const acwr = acwrCalculator.calculateACWR();

    if (acwr !== null) {
    console.log(`Adjusted ACWR: ${acwr.toFixed(2)}`);
    } else {
      console.log("Unable to calculate ACWR. Please check input values.");
    }
    const xAxisLabel1="Days of the week";
    const yAxisLabel1="Quality of Sleep ";
    const heading1="Heading for Quality of Sleep";
    createGraph(data,"d3-chart-container1",xAxisLabel1,yAxisLabel1,heading1);
    const yAxisLabel2="RPE ";
    const heading2="Heading for RPE";
    createGraph(data2,"d3-chart-container2",xAxisLabel1,yAxisLabel2,heading2);
    const yAxisLabel3=" Pain Scale" ;
    const heading3="Heading for Pain Scale";
    createGraph(data3,"d3-chart-container3",xAxisLabel1,yAxisLabel3,heading3);
    const yAxisLabel4="Mental health Scale ";
    const heading4="Heading for Mental health Scale";
    //createGraph(data4,"d3-chart-container4",xAxisLabel1,yAxisLabel4,heading4);
    }
    }, [data,data2,data3]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>The progress will be shown here</Text>
      <View style={styles.chartContainer} id="d3-chart-container1"></View>
      <View style={styles.chartContainer} id="d3-chart-container2"></View>
      <View style={styles.chartContainer} id="d3-chart-container3"></View>
    
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  text: {
    fontFamily: 'Roboto',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
});

export default ProgressScreen;





class ACWRCalculator {
  constructor(plannedWorkInMinutes, completedWork, heartRate) {
    this.plannedWorkInMinutes = plannedWorkInMinutes;
    this.completedWork = completedWork;
    this.heartRate = heartRate;
  }

  calculateACWR() {
    if (this.plannedWorkInMinutes <= 0 || this.heartRate <= 0) {
      console.error("Planned work and heart rate should be greater than 0.");
      return null;
    }

    const acwr = (this.completedWork / this.plannedWorkInMinutes) * 100;
    const adjustedACWR = acwr / (this.heartRate / 60); // assuming heart rate is in beats per minute

    return adjustedACWR;
  }
}

const createGraph = (data, containerId,xAxisLabel,yAxisLabel,heading) => {
  const margin = { top: 60, right: 30, bottom: 70, left: 70 };
  const width = 400 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const svg = d3
    .select(`#${containerId}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xScale = d3
    .scaleBand()
    .domain(weekdays)
   // .domain(data.map((_, i) => i))
    .range([0, width])
    .padding(0.1);

  const yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(xAxis);
  svg.append('g').attr('class', 'y-axis').call(yAxis);

   // Append x-axis label
  svg
    .append('text')
    .attr('transform', `translate(${width / 2},${height + margin.top })`)
    .style('text-anchor', 'middle')
    .text(xAxisLabel);

  // Append y-axis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text(yAxisLabel);
  
   // Append heading
   svg
   .append('text')
   .attr('x', width / 2)
   .attr('y', 0 - margin.top / 2)
   .attr('text-anchor', 'middle')
   .style('font-size', '1.5em')
   .text(heading);
  
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(weekdays[i]))
    .attr('y', d => yScale(d))
    .attr('width', xScale.bandwidth())
    .attr('height', d => height - yScale(d))
    .attr('fill', 'blue');
};

