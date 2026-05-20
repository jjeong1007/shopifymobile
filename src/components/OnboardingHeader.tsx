import './OnboardingHeader.css';

export type OnboardingStep = 1 | 2 | 3;

const TOTAL_STEPS = 3;

type OnboardingHeaderProps = {
  step: OnboardingStep;
  showBack?: boolean;
  onBack?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
};

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M7.5 5l5 5-5 5"
        stroke="#1A1A1A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M12.5 5l-5 5 5 5"
        stroke="#1A1A1A"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OnboardingHeader({
  step,
  showBack = false,
  onBack,
  showSkip = false,
  onSkip,
}: OnboardingHeaderProps) {
  return (
    <header className="onboarding-header">
      <div className="onboarding-header__nav">
        {showBack ? (
          <button type="button" className="onboarding-header__back" onClick={onBack} aria-label="Go back">
            <ChevronLeftIcon />
            <span>Back</span>
          </button>
        ) : (
          <span className="onboarding-header__nav-spacer" aria-hidden />
        )}

        {showSkip ? (
          <button type="button" className="onboarding-header__skip" onClick={onSkip}>
            <span>Skip</span>
            <ChevronRightIcon />
          </button>
        ) : (
          <span className="onboarding-header__nav-spacer" aria-hidden />
        )}
      </div>

      <div
        className="onboarding-header__progress"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step}
        aria-label={`Onboarding step ${step} of ${TOTAL_STEPS}`}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, index) => {
          const segmentStep = (index + 1) as OnboardingStep;
          const isComplete = segmentStep < step;
          const isCurrent = segmentStep === step;

          return (
            <span
              key={segmentStep}
              className={`onboarding-header__segment${
                isComplete || isCurrent ? ' onboarding-header__segment--filled' : ''
              }${isCurrent ? ' onboarding-header__segment--current' : ''}`}
            />
          );
        })}
      </div>
    </header>
  );
}
