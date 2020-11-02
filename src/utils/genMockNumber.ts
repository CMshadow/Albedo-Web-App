interface IGenMockNumber {
  (param: {base: number, increase: number}): number
}

// 给一个底数，一个每日增加数，生成一个当前的假数字，日期差为当前日期-2020/07/18
export const genMockNumber: IGenMockNumber = ({base, increase}) => {
  const date1 = new Date("07/18/2020");
  const date2 = new Date();

  const Difference_In_Time = date2.getTime() - date1.getTime();
  const Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));

  return base + Math.round(increase) * Difference_In_Days
}
