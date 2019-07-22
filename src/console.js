console.dab = () => {
  console.log(
    '%c   ', 'font-size: 110px; background: url(https://i.imgur.com/WuwOOPN.gif) no-repeat;',
  );
};

console.color = (...args) => {
  const newArgs = [...args];

  const colors = [
    'aqua',
    'chartreuse',
    'crimson',
    'fuchsia',
    'gold',
    'goldenrod',
    'green',
    'greenyellow',
    'hotpink',
    'khaki',
    'lightsalmon',
    'lime',
    'orange',
    'orangered',
    'purple',
    'red',
    'skyblue',
    'steelblue',
    'teal',
    'violet',
    'white',
    'yellow',
    'yellowgreen',
  ];

  /**
   * @param {string} string - String to calc color for.
   *
   * @returns {string}
   */
  const calcStyle = (string) => {
    let index = 0, add = 'padding: 2px 0;';

    for (let i = 0; i < string.length; i++) {
      index = index + string.charCodeAt(i);
    }

    if (index % 2 === 0) {
      add += 'font-weight: bold;';
    }

    return `color: ${colors[index % colors.length]}; ${add}`;
  };

  newArgs.splice(0, 1, `%c${newArgs[0]}`, calcStyle(newArgs[0]));

  console.log(...newArgs);
};
