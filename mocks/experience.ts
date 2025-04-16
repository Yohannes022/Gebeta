import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "1",
    title: "Traditional Ethiopian Coffee Ceremony",
    description:
      "Experience the authentic Ethiopian coffee ceremony, where coffee beans are roasted, ground, and brewed right in front of you. Learn about the cultural significance of coffee in Ethiopia and enjoy three rounds of freshly brewed coffee served with traditional snacks. This intimate experience takes place in a local home in Addis Ababa.",
    images: [
      "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    price: 35,
    currency: "USD",
    location: {
      city: "Addis Ababa",
      address: "Bole District, Addis Ababa",
      latitude: 9.0222,
      longitude: 38.7468,
    },
    host: {
      id: "h1",
      name: "Makeda",
      avatar:
        "https://images.unsplash.com/photo-1589156280159-27698a70f29e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      reviewCount: 127,
      description:
        "Coffee enthusiast and cultural ambassador sharing Ethiopian traditions for over 5 years.",
      responseRate: 98,
      responseTime: "within an hour",
      isSuperhost: true,
    },
    rating: 4.9,
    reviewCount: 214,
    category: "Coffee",
    duration: 2,
    maxGuests: 6,
    includes: [
      "Coffee tasting",
      "Traditional snacks",
      "Cultural insights",
      "Take-home coffee sample",
    ],
    reviews: [
      {
        id: "r1",
        user: {
          id: "u1",
          name: "Sarah",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 5,
        date: "2023-05-15",
        comment:
          "Such an authentic experience! Makeda was knowledgeable and welcoming. The coffee was incredible!",
      },
      {
        id: "r2",
        user: {
          id: "u2",
          name: "James",
          avatar:
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 4.5,
        date: "2023-04-22",
        comment:
          "Great cultural experience. The coffee was delicious and I learned so much about Ethiopian traditions.",
      },
    ],
    dates: [
      "2023-06-15",
      "2023-06-16",
      "2023-06-17",
      "2023-06-18",
      "2023-06-19",
    ],
  },
  {
    id: "2",
    title: "Master Injera Making Class",
    description:
      "Learn to make perfect injera, the sourdough flatbread that is the foundation of Ethiopian cuisine. In this hands-on class, you will learn the art of fermentation, pouring, and cooking this unique bread. Take home your own starter and recipes to continue practicing at home.",
    images: [
      "https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1535007729222-7d877f672f2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1515942400420-2b98fed1f515?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    price: 45,
    currency: "USD",
    location: {
      city: "Addis Ababa",
      address: "Kazanchis, Addis Ababa",
      latitude: 9.0127,
      longitude: 38.7585,
    },
    host: {
      id: "h2",
      name: "Tigist",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviewCount: 89,
      description:
        "Chef and cooking instructor specializing in traditional Ethiopian cuisine for over 10 years.",
      responseRate: 95,
      responseTime: "within a day",
      isSuperhost: true,
    },
    rating: 4.8,
    reviewCount: 156,
    category: "Injera",
    duration: 3,
    maxGuests: 8,
    includes: [
      "All ingredients",
      "Cooking equipment",
      "Recipe booklet",
      "Injera starter to take home",
    ],
    reviews: [
      {
        id: "r3",
        user: {
          id: "u3",
          name: "Michael",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 5,
        date: "2023-05-05",
        comment:
          "Tigist is an amazing teacher! I never thought I could make injera at home, but now I feel confident. Highly recommend!",
      },
      {
        id: "r4",
        user: {
          id: "u4",
          name: "Emily",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 4.5,
        date: "2023-04-18",
        comment:
          "Such a fun class! The injera we made was delicious and I learned so much about Ethiopian cooking techniques.",
      },
    ],
    dates: [
      "2023-06-20",
      "2023-06-21",
      "2023-06-22",
      "2023-06-23",
      "2023-06-24",
    ],
  },
  {
    id: "3",
    title: "Doro Wat Cooking Experience",
    description:
      "Learn to cook Ethiopia's national dish, Doro Wat (spicy chicken stew), from a professional chef. This hands-on cooking class will teach you how to blend the perfect berbere spice mix and create this iconic dish from scratch. Enjoy your creation with injera bread and traditional sides.",
    images: [
      "https://images.unsplash.com/photo-1567364816519-cbc9c4ffe228?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    price: 55,
    currency: "USD",
    location: {
      city: "Addis Ababa",
      address: "Piazza, Addis Ababa",
      latitude: 9.0359,
      longitude: 38.7478,
    },
    host: {
      id: "h3",
      name: "Dawit",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.9,
      reviewCount: 112,
      description:
        "Professional chef with experience in top Ethiopian restaurants, passionate about sharing authentic cooking techniques.",
      responseRate: 100,
      responseTime: "within a few hours",
      isSuperhost: true,
    },
    rating: 4.9,
    reviewCount: 178,
    category: "Doro Wat",
    duration: 3,
    maxGuests: 6,
    includes: [
      "All ingredients",
      "Cooking equipment",
      "Meal with drinks",
      "Recipe booklet",
      "Spice blend to take home",
    ],
    reviews: [
      {
        id: "r5",
        user: {
          id: "u5",
          name: "David",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 5,
        date: "2023-05-10",
        comment:
          "Dawit is an incredible teacher and chef. The Doro Wat we made was better than any I've had in restaurants. Worth every penny!",
      },
      {
        id: "r6",
        user: {
          id: "u6",
          name: "Sophia",
          avatar:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 5,
        date: "2023-04-28",
        comment:
          "Amazing experience! I learned so much about Ethiopian spices and cooking techniques. The meal was absolutely delicious.",
      },
    ],
    dates: [
      "2023-06-18",
      "2023-06-19",
      "2023-06-20",
      "2023-06-25",
      "2023-06-26",
    ],
  },
  {
    id: "4",
    title: "Ethiopian Vegetarian Feast",
    description:
      "Discover the rich variety of Ethiopian vegetarian dishes in this hands-on cooking class. Learn to prepare a colorful spread of dishes including misir wat (spiced red lentils), gomen (collard greens), tikil gomen (cabbage and carrots), and shiro (ground chickpea stew). Perfect for vegetarians and vegans!",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    price: 50,
    currency: "USD",
    location: {
      city: "Addis Ababa",
      address: "Arat Kilo, Addis Ababa",
      latitude: 9.0372,
      longitude: 38.7612,
    },
    host: {
      id: "h4",
      name: "Hiwot",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.8,
      reviewCount: 95,
      description:
        "Specializing in plant-based Ethiopian cuisine, I love sharing the rich vegetarian traditions of my culture.",
      responseRate: 97,
      responseTime: "within a day",
      isSuperhost: false,
    },
    rating: 4.8,
    reviewCount: 142,
    category: "Vegetarian",
    duration: 3,
    maxGuests: 8,
    includes: [
      "All ingredients (vegan options available)",
      "Cooking equipment",
      "Meal with drinks",
      "Recipe booklet",
    ],
    reviews: [
      {
        id: "r7",
        user: {
          id: "u7",
          name: "Rachel",
          avatar:
            "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 5,
        date: "2023-05-12",
        comment:
          "As a vegan, I was thrilled to learn authentic Ethiopian plant-based cooking. Hiwot is knowledgeable and made the class so enjoyable!",
      },
      {
        id: "r8",
        user: {
          id: "u8",
          name: "Thomas",
          avatar:
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 4.5,
        date: "2023-04-30",
        comment:
          "Great class! I never knew vegetarian food could be so flavorful and satisfying. Highly recommend even for non-vegetarians.",
      },
    ],
    dates: [
      "2023-06-17",
      "2023-06-18",
      "2023-06-24",
      "2023-06-25",
      "2023-06-30",
    ],
  },
  {
    id: "5",
    title: "Ethiopian Breakfast Experience",
    description:
      "Start your day the Ethiopian way! Learn to prepare a traditional Ethiopian breakfast including genfo (barley porridge), kinche (cracked wheat), and chechebsa (shredded flatbread with spiced butter). Enjoy your creations with traditional coffee or tea.",
    images: [
      "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      "https://images.unsplash.com/photo-1509482560494-4126f8225994?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    ],
    price: 40,
    currency: "USD",
    location: {
      city: "Addis Ababa",
      address: "Meskel Square, Addis Ababa",
      latitude: 9.0105,
      longitude: 38.7612,
    },
    host: {
      id: "h5",
      name: "Bethlehem",
      avatar:
        "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      rating: 4.7,
      reviewCount: 78,
      description:
        "Morning person and breakfast enthusiast! I love sharing the diverse breakfast traditions of Ethiopia.",
      responseRate: 94,
      responseTime: "within a day",
      isSuperhost: false,
    },
    rating: 4.7,
    reviewCount: 105,
    category: "Breakfast",
    duration: 2,
    maxGuests: 6,
    includes: [
      "All ingredients",
      "Cooking equipment",
      "Breakfast meal with coffee/tea",
      "Recipe booklet",
    ],
    reviews: [
      {
        id: "r9",
        user: {
          id: "u9",
          name: "Jennifer",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 5,
        date: "2023-05-08",
        comment:
          "What a delightful morning! The breakfast dishes were so different from what I'm used to but absolutely delicious. Bethlehem is a wonderful host.",
      },
      {
        id: "r10",
        user: {
          id: "u10",
          name: "Daniel",
          avatar:
            "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
        },
        rating: 4.5,
        date: "2023-04-25",
        comment:
          "Great way to start the day! I especially loved the chechebsa and the coffee ceremony. Very informative and tasty!",
      },
    ],
    dates: [
      "2023-06-16",
      "2023-06-17",
      "2023-06-23",
      "2023-06-24",
      "2023-06-30",
    ],
  },
];
