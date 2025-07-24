// server/seed.js

const mongoose = require('mongoose');
const Resume = require('./models/resume');
require('dotenv').config();

const sampleResumes = [
    {
        title: 'Software Engineer Resume',
        description: 'A professional, modern resume template for software engineers.',
        priceInCents: 499, // $4.99
        fileName: 'software-engineer-resume.pdf',
    },
    {
        title: 'Graphic Designer Resume',
        description: 'A creative and visually appealing resume for graphic designers.',
        priceInCents: 599, // $5.99
        fileName: 'graphic-designer-resume.pdf',
    },
    {
        title: 'Project Manager Resume',
        description: 'A clean and organized resume for project managers.',
        priceInCents: 450, // $4.50
        fileName: 'project-manager-resume.pdf',
    },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected for seeding");

        await Resume.deleteMany({});
        console.log("🧹 Cleared existing resumes");

        await Resume.insertMany(sampleResumes);
        console.log("🌱 Database seeded with sample resumes!");

    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await mongoose.disconnect();
        console.log("❌ MongoDB disconnected");
    }
};

seedDatabase();