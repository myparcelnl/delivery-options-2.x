async(payload) => {

  const barcode = payload.params.barcode[0].value.match(/3SMYPA[0-9]*|3SMYPO[0-9]*|CG[0-9]*NL/);
  const postcode = payload.params.postcode[0].value.match(
    /[1-9][0-9]{3} ?(?!sa|sd|ss)[a-zA-Z]{2}|(?:(?:[1-9])(?:\d{3}))|(?:[0-8]\d|9[0-8])\d{3}/
  );
  // const postcode = payload.params.postcode.forEach
  // var postcode = '2132WT';

  const endpoint = `https://api.myparcel.nl/tracktraces/?postal_code=${postcode}&barcode=${barcode}`;

  try {
    const response = await request.get(endpoint, {
      headers: {
        Authorization: 'basic ZTQ4YzRjNmM5MDM3ODcxYjBlMGFjMjAwYzllMDUxNTI1MjEwNWU1Nw==',
      },
    });

    console.log(response);

    const status = response.data.data.tracktraces[0].description;

    const tracktrace_link = response.data.data.tracktraces[0].link_consumer_portal;

    console.log(tracktrace_link);

    reply(new Message([
      `Ik heb jouw zending gevonden! De verzendstatus is: ${
        status
      }, en de track and trace link is: ${
        tracktrace_link}`,
    ]));

    trigger('FEEDBACK VERZENDSTATUS');

  } catch (err) {

    // Message to reply
    const message = new Message(
      'Oops.. op deze postcode en barcode kan ik geen zending vinden. Weet je zeker dat je de juiste gegevens hebt ingevoerd?'
    );

    message.addQuickReply(new QuickReply({
      label: 'Ja',
      type: 'event',
      value: 'CONTACT MEDEWERKER',
    }));
    message.addQuickReply(new QuickReply({
      label: 'Nee',
      type: 'event',
      value: 'STATUS_ZENDING_TWEEDE_POGING',
    }));

    return message;

  }
};
