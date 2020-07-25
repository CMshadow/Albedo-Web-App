export const genMockNumber = ({base, increase}) => {
  const date1 = new Date("07/18/2020");
  const date2 = new Date();

  const Difference_In_Time = date2.getTime() - date1.getTime();
  const Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return base + Math.round(increase) * Difference_In_Days
}
