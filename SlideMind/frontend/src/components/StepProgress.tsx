import React from 'react';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const steps = [
  { label: 'Tải lên' },
  { label: 'Tùy chỉnh' },
  { label: 'Xử lý' },
  { label: 'Kết quả' }
];

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-4 px-4">
      <div className="flex items-center justify-center max-w-lg mx-auto">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                    ${isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-[#1e3a5f] text-white ring-4 ring-blue-200'
                        : 'bg-gray-200 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    stepNum
                  )}
                </div>
                <span className={`mt-1 text-xs font-medium ${isActive ? 'text-[#1e3a5f]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;
