import { getGradeColor } from '../utils/gradeColors';

type GradePillProps = {
  grade: string;
  className?: string;
};

export const GradePill = ({ grade, className = '' }: GradePillProps) => {
  const gc = getGradeColor(grade);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`.trim()}
      style={{ backgroundColor: gc.light, color: gc.solid }}
    >
      {grade}
    </span>
  );
};
