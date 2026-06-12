"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { Button } from "@/components/Button";
import { QuestionOption } from "@/components/QuestionOption";
import { Clock, Flag } from "lucide-react";

const mockQuestions = [
  {
    id: 1,
    question: "What is the value of x in the equation 2x + 5 = 15?",
    options: ["x = 3", "x = 5", "x = 7", "x = 10"],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which of the following is a prime number?",
    options: ["12", "15", "17", "20"],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "What is the square root of 144?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question:
      "If a triangle has angles 60°, 60°, and 60°, what type of triangle is it?",
    options: ["Scalene", "Isosceles", "Equilateral", "Right-angled"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What is 25% of 80?",
    options: ["15", "20", "25", "30"],
    correctAnswer: 1,
  },
];

export default function TestInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    new Array(mockQuestions.length).fill(-1),
  );
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSubmit = () => {
    // Store answers and navigate to results
    redirect("/student/test/result");
  };

  const question = mockQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-blue-600" />
            <span className="text-lg text-gray-900">
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="text-gray-900">
            Question {currentQuestion + 1} of {mockQuestions.length}
          </div>
          <Button variant="outline" size="sm" onClick={handleSubmit}>
            Submit Test
          </Button>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start gap-4 mb-8">
            <span className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
              {currentQuestion + 1}
            </span>
            <p className="text-xl text-gray-900 leading-relaxed">
              {question.question}
            </p>
          </div>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <QuestionOption
                key={index}
                option={String.fromCharCode(65 + index)}
                label={option}
                isSelected={answers[currentQuestion] === index}
                onClick={() => handleSelectAnswer(index)}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={currentQuestion === mockQuestions.length - 1}
          >
            Skip
          </Button>

          <div className="flex gap-3">
            {currentQuestion === mockQuestions.length - 1 ? (
              <Button onClick={handleSubmit} size="lg">
                Submit Test
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentQuestion === mockQuestions.length - 1}
                size="lg"
              >
                Next Question
              </Button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm text-gray-600 mb-4">Question Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {mockQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
                  currentQuestion === index
                    ? "bg-blue-600 text-white"
                    : answers[index] !== -1
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
