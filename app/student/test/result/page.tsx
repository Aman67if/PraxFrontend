"use client";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { QuestionOption } from "@/components/QuestionOption";
import { CheckCircle2, XCircle, Clock, Target, Award } from "lucide-react";

export default function ResultPage() {
  // const location = useLocation();
  // const { answers = [], questions = [] } = location.state || {};
  const { answers = [], questions = [] } = {};
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Calculate results
  const totalQuestions = questions.length;
  const correctAnswers = answers.filter(
    (answer: number, index: number) =>
      // answer === questions[index]?.correctAnswer
      answer === questions[index],
  ).length;
  const incorrectAnswers = answers.filter(
    (answer: number, index: number) =>
      // answer !== -1 && answer !== questions[index]?.correctAnswer
      answer !== -1 && answer !== questions[index],
  ).length;
  const skipped = answers.filter((answer: number) => answer === -1).length;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  const explanations = [
    "To solve 2x + 5 = 15, subtract 5 from both sides: 2x = 10, then divide by 2: x = 5",
    "17 is a prime number because it is only divisible by 1 and itself.",
    "The square root of 144 is 12, because 12 × 12 = 144.",
    "A triangle with all angles equal (60° each) is an equilateral triangle.",
    "25% of 80 is calculated as (25/100) × 80 = 20.",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Award size={40} className="text-blue-600" />
          </div>
          <h1 className="text-3xl mb-2 text-gray-900">Test Completed! 🎉</h1>
          <p className="text-gray-600">Here's how you performed</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-2xl text-gray-900 mb-1">{totalQuestions}</div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </Card>
          <Card className="text-center bg-green-50 border-green-200">
            <div className="text-2xl text-green-600 mb-1">{correctAnswers}</div>
            <div className="text-sm text-gray-600">Correct</div>
          </Card>
          <Card className="text-center bg-red-50 border-red-200">
            <div className="text-2xl text-red-600 mb-1">{incorrectAnswers}</div>
            <div className="text-sm text-gray-600">Incorrect</div>
          </Card>
          <Card className="text-center bg-blue-50 border-blue-200">
            <div className="text-2xl text-blue-600 mb-1">{accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </Card>
        </div>

        {/* Performance Summary */}
        <Card className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Target size={24} className="text-blue-600" />
            <h2 className="text-xl text-gray-900">Performance Summary</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time Taken</span>
              <span className="text-gray-900">18:45</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Questions Skipped</span>
              <span className="text-gray-900">{skipped}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Time per Question</span>
              <span className="text-gray-900">3:45</span>
            </div>
          </div>
        </Card>

        {/* Question-wise Analysis */}
        <Card className="mb-8">
          <h2 className="text-xl mb-6 text-gray-900">Detailed Analysis</h2>
          <div className="space-y-4">
            {questions.map((question: any, index: number) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              const isExpanded = expandedQuestion === index;

              return (
                <div
                  key={index}
                  className={`border rounded-lg ${
                    isCorrect
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <button
                    onClick={() =>
                      setExpandedQuestion(isExpanded ? null : index)
                    }
                    className="w-full p-4 flex items-start gap-4 text-left"
                  >
                    <div className="shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircle2 size={20} className="text-green-600" />
                      ) : (
                        <XCircle size={20} className="text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-gray-900">
                          <span className="mr-2">Q{index + 1}.</span>
                          {question.question}
                        </p>
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          {isExpanded ? "−" : "+"}
                        </span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-4">
                      <div className="pl-9 space-y-3">
                        {question.options.map(
                          (option: string, optIndex: number) => (
                            <QuestionOption
                              key={optIndex}
                              option={String.fromCharCode(65 + optIndex)}
                              label={option}
                              isSelected={userAnswer === optIndex}
                              onClick={() => {}}
                              showCorrect={true}
                              isCorrect={optIndex === question.correctAnswer}
                            />
                          ),
                        )}
                      </div>
                      <div className="pl-9 pt-4 border-t border-gray-200">
                        <h4 className="text-sm text-gray-600 mb-2">
                          Explanation
                        </h4>
                        <p className="text-gray-700 bg-white p-4 rounded-lg">
                          {explanations[index]}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/student/enrolled-tests">
            <Button size="lg">Attempt Another Test</Button>
          </Link>
          <Link href="/student">
            <Button variant="outline" size="lg">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
