import React, { useState,useEffect } from 'react';
import { BarChart } from 'react-native-chart-kit';
import * as d3 from 'd3';
import { db , auth} from "../firebase";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { getAuth } from '@firebase/auth';
import { getDatabase, ref, onValue, set,get,push } from 'firebase/database';


const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) {
    return null;
  }

  const dob = new Date(dateOfBirth);
  const currentDate = new Date();

  let age = currentDate.getFullYear() - dob.getFullYear();

  // Check if the birthday has occurred this year
  if (
    currentDate.getMonth() < dob.getMonth() ||
    (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
};

const bmiColor = (bmi) => {
  if (!bmi) {
    // Return a default color if BMI is not available
    return 'black';
  }

  if (bmi < 18.5) {
    return 'red'; // Underweight
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return 'green'; // Healthy Weight
  } else if (bmi >= 25.0 && bmi <= 29.9) {
    return 'red'; // Overweight
  } else {
    return 'red'; // Obese
  }
};

const ProgressScreen = ({ navigation }) => {
  // Sample data for the D3 bar chart
  const [ACWR, setACWR] = useState(null);
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bmi, setBMI] = useState('');
  const [sportSpeciality, setSportSpeciality] = useState(null);
  const [age, setAge] = useState(null);
  //const data = [20, 30, 20, 50,40,50,70];
  //const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [RPEdata, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [Duration, setDuration] = useState([]);
  //const [data4, setData4] = useState([]);
  const [ACWRList, setACWRLIst] = useState('');
  const userA = auth.currentUser;
  const userSurveyRef = ref(db, `DataToPlot/${userA.uid}`);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(userSurveyRef);
        if (snapshot.exists()) {
          const dataFromFirebase = snapshot.val();
          setData(dataFromFirebase.qualityOfSleep || '');
          setData2(dataFromFirebase.rpe || '');
          setData3(dataFromFirebase.painScale || '');
          setDuration(dataFromFirebase.duration || '');
          setACWRLIst(dataFromFirebase.ACWRVal || '');
          console.log("We fetched")
          //setData4(dataFromFirebase.mentalhealthscale || '');
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userA) {
      fetchData(); // Invoke the async function immediately
    }
  }, [userA]);

  useEffect(() => {
    if (data.length>0 && Duration.length>0){
    // Set up the SVG canvas dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 400 - margin.left - margin.right;
    //const height = 300 - margin.top - margin.bottom;
    //const barWidth = width / data.length;
      console.log(data);
      //const DuraSize=Duration.length;
    // Example usage:
    const plannedWorkInMinutes = 0; // replace with your planned work duration in minutes
    const completedWork = 0; // replace with your completed work value
    //const heartRate = 70; // replace with your heart rate value

    const acwrCalculator = new ACWRCalculator(Duration, RPEdata);
    const acwr = acwrCalculator.calculateACWR();

    if (acwr !== null) {
    console.log(`Adjusted ACWR: ${acwr.toFixed(2)}`);
    setACWR(acwr);
    get(userSurveyRef)
    .then((snapshot) => {
      const data = snapshot.val() || {};
      data.ACWRVal = data.ACWRVal || [];
      data.ACWRVal.push(acwr);
      set(userSurveyRef, data)
    .then(() => {
      console.log('Data saved to the Realtime Database');
     // alert('Data has been saved');
      //navigation.navigate('Player');
    })
    .catch((error) => {
      console.error('Error saving data to the Realtime Database:', error);
    });
    });
    } else {
      console.log("Unable to calculate ACWR. Please check input values.");
    }
    const xAxisLabel1="Last 7 days";
    const yAxisLabel1="Quality of Sleep ";
    const heading1="Heading for Quality of Sleep";
    createGraph(data,"d3-chart-container1",xAxisLabel1,yAxisLabel1,heading1);
    const yAxisLabel2="RPE ";
    const heading2="Heading for RPE";
    createGraph(RPEdata,"d3-chart-container2",xAxisLabel1,yAxisLabel2,heading2);
    const yAxisLabel3=" Pain Scale" ;
    const heading3="Heading for Pain Scale";
    createGraph(data3,"d3-chart-container3",xAxisLabel1,yAxisLabel3,heading3);
    const yAxisLabel4="Mental health Scale ";
    const heading4="Heading for Mental health Scale";
    //createGraph(data4,"d3-chart-container4",xAxisLabel1,yAxisLabel4,heading4);
    }
    }, [data,RPEdata,data3,Duration]);



class ACWRCalculator {
  
  constructor(Duration, RPEdata) {
    if(Duration.length==0 || RPEdata.length==0){
      return null;
    }
    this.plannedWorkInMinutes = Duration[Duration.length-1];
    this.completedWork = RPEdata[ RPEdata.length-1];
   // this.heartRate = heartRate;
  }

  calculateACWR() {
    if (this.plannedWorkInMinutes <= 0 ) {
      console.error("Planned work should be greater than 0.");
      return null;
    }

    const acwr = (this.completedWork *this.plannedWorkInMinutes) ;
    var  acwrTotal=0;
    var num=0;
    //const adjustedACWR = acwr / (this.heartRate / 60); // assuming heart rate is in beats per minute
    var start=0;
    if(RPEdata.length>28){
      start=RPEdata.length- 28;
    }
    num =RPEdata.length-start;
    for (let index = start; index < RPEdata.length; index++) {
      const element = RPEdata[index];
      const element2 = Duration[index];
      acwrTotal+=element*element2;
      
    }
    if(num!=0){
      acwrTotal=acwrTotal/num
    }
    const adjustedACWR=acwr/acwrTotal;
    return adjustedACWR;
  }
}

const createGraph = (data, containerId,xAxisLabel,yAxisLabel,heading) => {
  const margin = { top: 60, right: 30, bottom: 70, left: 70 };
  const width = 400 - margin.left - margin.right;
  const height = 300 - margin.top - margin.bottom;
  const weekdays = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'];
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

  const yScale = d3.scaleLinear().domain([0, 10]).range([height, 0]);

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

  

  useEffect(() => {
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserData(user.uid);
      } else {
        setUser(null);
        setUserName('');
      }
    });
  
    return () => unsubscribe();
  }, [auth]);

  const fetchUserData = (userId) => {
    const db = getDatabase();
    const userRef = ref(db, `Athletes/${userId}`);
    
    // Set up a listener for changes in the user's data
    onValue(userRef, (snapshot) => {
      console.log('User Data:', snapshot.val());  // Log the entire snapshot for debugging
      const userData = snapshot.val();
      if (userData) {
        setUserName(userData.name || '');
        setHeight(userData.height || '');
        setWeight(userData.weight || '');
        setBMI(userData.bmi || '');
        setSportSpeciality(userData.sportSpeciality || '');
        setAge(calculateAge(userData.dateOfBirth));
        setUser(userData);
      }
    });
  };
  const bmiColor = (bmi) => {
    if (!bmi) {
      // Return a default color if BMI is not available
      return 'black';
    }
  
    if (bmi < 18.5) {
      return 'red'; // Underweight
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return 'green'; // Healthy Weight
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      return 'red'; // Overweight
    } else {
      return 'red'; // Obese
    }
  };



  const handleUpdateProfile = () => {
    // Navigate to the UpdateProfile screen
    navigation.navigate('Update');
  };
  

  return (
    
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.text}>{userName}'s progress</Text>
      <View style={styles.chartContainer} id="d3-chart-container1"></View>
      <View style={styles.chartContainer} id="d3-chart-container2"></View>
      <View style={styles.chartContainer} id="d3-chart-container3"></View>

    
      

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Height:</Text>
        <Text style={styles.input}>{height? `${height.toString()} m` : 'NOT SPECIFIED'}</Text>
      </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Weight:</Text>
      <Text style={styles.input}>{weight? `${weight.toString()} kg` : 'NOT SPECIFIED'}</Text>
    </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>BMI:</Text>
        <Text style={styles.input}>{bmi ? bmi.toString() : 'NOT SPECIFIED'}</Text>
        {bmi && (
          <View style={{ width: 20, height: 20, backgroundColor: bmiColor(bmi) }} />
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>SportSpeciality:</Text>
        <Text style={styles.input}>{sportSpeciality ? sportSpeciality.toString() : 'NOT SPECIFIED'}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Age:</Text>
        <Text style={styles.input}>{age ? age.toString() : 'NOT SPECIFIED'}</Text>
      </View>
      {ACWR != null && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>ACWR:</Text>
          <Text style={styles.input}>{ACWR.toString()}</Text>
        </View>
      )}


      <TouchableOpacity style={styles.updateProfileButton} onPress={handleUpdateProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>


</ScrollView>

  );
};  

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'left',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
  },

  text: {
    fontFamily: 'Roboto',
    fontSize: 28,
    marginBottom: 40,
    color: '#051d5f',
  },
  chartContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 20,
    color: '#051d5f',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 1,
  },
  input: {
    height: 40,
    borderColor: 'white',
    marginBottom: 2,
    paddingHorizontal: 20,
    flex: 10,
  },
  updateProfileButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#2e64e5',
    borderRadius: 5,
  },
  buttonText: {
    fontSize:12,
    width: 300, 
    color: 'white',
    textAlign: 'center',
  },
  spacer: {
    width: 128, 
  },

});











export default ProgressScreen;