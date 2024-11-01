const Outing = require("../models/Outing");
const Student = require("../models/Student");
const CareTaker = require("../models/CareTaker");
const { Op } = require('sequelize'); // If you're using Sequelize ORM

const createOuting = async (req, res) => {
  try {
    const { studentName, date, reason, year } = req.body;
    const studentEmail = req.mainEmail;

    const student = await Student.findOne({ email: studentEmail });
    const studentId = student._id;

    // Convert the provided date to a JavaScript Date object to get the month and year
    const outingDate = new Date(date);
    const month = outingDate.getMonth(); // Month is zero-based (0 = January, 11 = December)
    const yearOfOuting = outingDate.getFullYear();

    // Count outings requested by the student in the same month and year
    const outingsInMonth = await Outing.countDocuments({
      studentId,
      date: {
        $gte: new Date(yearOfOuting, month, 1), // Start of the month
        $lt: new Date(yearOfOuting, month + 1, 1) // Start of the next month
      }
    });

    if (outingsInMonth >= 3) {
      return res.status(400).json({ message: "Outing limit exceeded for this month" });
    }

    // Check if an outing already exists for the same date and student
    const existingOuting = await Outing.findOne({ date, studentId });
    if (existingOuting) {
      return res.status(400).json({ message: "Outing already requested for this date" });
    }

    // Create a new outing
    const newOuting = new Outing({
      studentName,
      date,
      studentId,
      year,
      reason,
      outingStatus: "pending",
    });

    await newOuting.save();

    // Add outing ID to student's outings array
    await Student.findByIdAndUpdate(studentId, {
      $push: { outings: newOuting._id }
    });

    res.status(201).json({ message: "Outing created successfully", outing: newOuting });
  } catch (error) {
    console.log(`Error at creating outing: ${error}`);
    res.status(500).json({ message: `${error}` });
  }
};


  const getAllOuting = async (req,res)=>{
    try {

        const outings = await Outing.find().populate("studentId");
        res.status(200).json({ outings });
        
    } catch (error) {
        console.log(`Error at getting all outings: ${error}`);
        res.status(500).json({ message: `${error}` }); 
    }
  }

const getOutingsByStudentId = async (req, res) => {
    try {
      const studentEmail = req.mainEmail;
      
      // Find the student by email
      const student = await Student.findOne({ email: studentEmail });
      
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      const studentId = student._id;
        const outings = await Outing.find({ studentId }).populate('studentId'); // Populate student details if needed

        if (!outings.length) {
            return res.status(404).json({ message: "No outings found for this student" });
        }

        res.status(200).json({ outings });
    } catch (error) {
        console.log(`Error at getting outings for student: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }

}

const updateOutingDetails = async (req, res) => {
    try {
        const { outingStatus, inTime, outTime } = req.body;
        const caretakerEmail = req.mainEmail;
      
      // Find the student by email
      const caretaker = await CareTaker.findOne({ email: caretakerEmail });
      
      if (!caretaker) {
          return res.status(404).json({ message: 'caretaker not found' });
      }

      const careTakerId = caretaker._id;
        const updatedOuting = await Outing.findByIdAndUpdate(
            req.params.id,
            {
                outingStatus,
                inTime,
                outTime,
                careTakerId
            },
            { new: true } // Return the updated document
        );

        if (!updatedOuting) {
            return res.status(404).json({ message: "Outing not found" });
        }

        res.status(200).json({ message: "Outing updated successfully", outing: updatedOuting });
    } catch (error) {
        console.log(`Error at updating outing details: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getLatestOuting = async (req, res) => {
  try {
      const studentEmail = req.mainEmail;
      
      // Find the student by email
      const student = await Student.findOne({ email: studentEmail });
      if (!student) {
          return res.status(404).json({ message: 'Student not found' });
      }

      const studentId = student._id;

      // Get the current date's month and year
      const now = new Date();
      const currentMonth = now.getMonth(); // 0 = January, 11 = December
      const currentYear = now.getFullYear();

      // Find outings of the student for the current month and year, sorted by creation date
      const monthlyOutings = await Outing.find({
          studentId,
          date: {
              $gte: new Date(currentYear, currentMonth, 1), // Start of the current month
              $lt: new Date(currentYear, currentMonth + 1, 1) // Start of the next month
          }
      }).sort({ createdAt: -1 }); // Sort by creation date in descending order

      // Check if any outings were found
      if (monthlyOutings.length > 0) {
          res.status(200).json({ latestOuting: monthlyOutings });
      } else {
          res.status(200).json({latestOuting: [] });
      }
  } catch (error) {
      console.error('Error retrieving latest outing:', error);
      res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



const cancelOuting = async (req, res) => {
  try {
    const outingId = req.params.id;
    const studentEmail = req.mainEmail;

    const student = await Student.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }
    const studentId = student._id;

    // Find and delete the outing
    const outing = await Outing.findOneAndDelete({ _id: outingId, studentId });
    if (!outing) {
      return res.status(404).json({ message: 'Outing not found or already deleted.' });
    }

    // Remove the outing ID from the student's outings array
    await Student.findByIdAndUpdate(studentId, {
      $pull: { outings: outingId },
    });

    res.status(200).json({ message: 'Outing deleted successfully.' });
  } catch (error) {
    console.error('Error deleting outing:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};


module.exports = {createOuting,getAllOuting,getOutingsByStudentId,updateOutingDetails,getLatestOuting,cancelOuting};


