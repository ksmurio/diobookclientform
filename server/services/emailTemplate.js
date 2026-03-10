export const templateConfirmacao = ({ nomeCliente, dataMarcacao, horaMarcacao }) => {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DioBoo//PT
BEGIN:VEVENT
SUMMARY:Agendamento - ${nomeCliente}
DTSTART:${formatarDataICS(dataMarcacao, horaMarcacao)}
DTEND:${formatarDataICS(dataMarcacao, horaMarcacao, 1)}
DESCRIPTION:Agendamento confirmado para ${nomeCliente}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
};

const formatarDataICS = (data, hora, addHoras = 0) => {
    const [ano, mes, dia] = data.split('-');
    const [h, m] = hora.split(':');
    const horaFinal = String(parseInt(h) + addHoras).padStart(2, '0');
    return `${ano}${mes}${dia}T${horaFinal}${m}00`;
};