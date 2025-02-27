const packages = [
  {
    id: 1,
    name: 'Pacote Paris Romântica',
    destination: 'Paris, França',
    departureDate: '2024-07-15',
    duration: '7 dias',
    price: 5999.99,
    availableSeats: 20,
    description: 'Uma semana inesquecível na cidade luz com hospedagem em hotel 4 estrelas, café da manhã incluído, passeios aos principais pontos turísticos e jantar na Torre Eiffel.',
    departureLocation: 'São Paulo',
    highlights: ['Torre Eiffel', 'Museu do Louvre', 'Palácio de Versalhes', 'Cruzeiro no Rio Sena'],
    included: ['Passagem aérea', 'Hospedagem', 'Café da manhã', 'Traslados', 'Passeios guiados']
  },
  {
    id: 2,
    name: 'Aventura na Amazônia',
    destination: 'Manaus, Brasil',
    departureDate: '2024-08-10',
    duration: '5 dias',
    price: 3499.99,
    availableSeats: 15,
    description: 'Explore a maior floresta tropical do mundo em uma experiência única. Inclui passeios de barco, trilhas na selva e visitas a comunidades locais.',
    departureLocation: 'São Paulo',
    highlights: ['Encontro das águas', 'Teatro Amazonas', 'Trilha na selva', 'Comunidades ribeirinhas'],
    included: ['Passagem aérea', 'Pousada', 'Todas as refeições', 'Guia especializado', 'Equipamentos']
  },
  {
    id: 3,
    name: 'Cultura Japonesa',
    destination: 'Tóquio, Japão',
    departureDate: '2024-09-20',
    duration: '10 dias',
    price: 8999.99,
    availableSeats: 12,
    description: 'Mergulhe na fascinante cultura japonesa com este pacote completo que inclui visitas a templos antigos, experiências gastronômicas e tecnologia de ponta.',
    departureLocation: 'São Paulo',
    highlights: ['Monte Fuji', 'Templos de Kyoto', 'Distrito de Akihabara', 'Trem-bala'],
    included: ['Passagem aérea', 'Hotel', 'JR Pass', 'Guia bilíngue', 'Algumas refeições']
  }
];

module.exports = packages;