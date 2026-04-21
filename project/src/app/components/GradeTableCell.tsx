import { GradePill } from './GradePill';

type GradeTableCellProps = {
  grade: string;
};

export const GradeTableCell = ({ grade }: GradeTableCellProps) => (
  <td className="px-4 py-3">
    <GradePill grade={grade} />
  </td>
);
