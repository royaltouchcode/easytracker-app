// Comprehensive Bangladesh Geo-Hierarchy Database (64 Districts -> Upazilas/Thanas -> Major Unions & Postal Areas)
// Structured for High-Performance Cascading Dropdowns & Courier SaaS Routing

export interface BangladeshUnion {
  nameBn: string;
  nameEn: string;
  postCode?: string;
}

export interface BangladeshUpazila {
  nameBn: string;
  nameEn: string;
  lat: number;
  lng: number;
  unions: BangladeshUnion[];
}

export interface BangladeshDistrict {
  id: string;
  nameBn: string;
  nameEn: string;
  divisionBn: string;
  divisionEn: string;
  lat: number;
  lng: number;
  upazilas: BangladeshUpazila[];
}

export const BANGLADESH_GEO_DATA: BangladeshDistrict[] = [
  // -------------------------------------------------------------
  // DHAKA DIVISION
  // -------------------------------------------------------------
  {
    id: 'dhaka',
    nameBn: 'ঢাকা',
    nameEn: 'Dhaka',
    divisionBn: 'ঢাকা',
    divisionEn: 'Dhaka',
    lat: 23.8103,
    lng: 90.4125,
    upazilas: [
      {
        nameBn: 'মিরপুর (Mirpur)',
        nameEn: 'Mirpur',
        lat: 23.8067,
        lng: 90.3687,
        unions: [
          { nameBn: 'মিরপুর ১০ (গোলচত্বর)', nameEn: 'Mirpur 10', postCode: '1216' },
          { nameBn: 'মিরপুর ১ (চিড়িয়াখানা রোড)', nameEn: 'Mirpur 1', postCode: '1216' },
          { nameBn: 'মিরপুর ২ (স্টেডিয়াম)', nameEn: 'Mirpur 2', postCode: '1216' },
          { nameBn: 'মিরপুর ১১ (কালশী)', nameEn: 'Mirpur 11', postCode: '1216' },
          { nameBn: 'মিরপুর ১২ (ডি ব্লু)', nameEn: 'Mirpur 12', postCode: '1216' },
          { nameBn: 'মিরপুর ১৪ (ক্যান্টনমেন্ট)', nameEn: 'Mirpur 14', postCode: '1206' },
          { nameBn: 'পল্লবী (Pallabi)', nameEn: 'Pallabi', postCode: '1216' },
          { nameBn: 'কাফরুল (Kafrul)', nameEn: 'Kafrul', postCode: '1216' }
        ]
      },
      {
        nameBn: 'উত্তরা (Uttara)',
        nameEn: 'Uttara',
        lat: 23.8728,
        lng: 90.3984,
        unions: [
          { nameBn: 'সেক্টর ১-৩ (আজমপুর)', nameEn: 'Sector 1-3 (Azampur)', postCode: '1230' },
          { nameBn: 'সেক্টর ৪-৬ (জসীমউদ্দীন)', nameEn: 'Sector 4-6', postCode: '1230' },
          { nameBn: 'সেক্টর ৭-৯ (হাউজবিল্ডিং)', nameEn: 'Sector 7-9', postCode: '1230' },
          { nameBn: 'সেক্টর ১০-১৪ (রবীন্দ্র সরণি)', nameEn: 'Sector 10-14', postCode: '1230' },
          { nameBn: 'উত্তরা ১৮ (মেট্রোরেল স্টেশন)', nameEn: 'Uttara Sector 18', postCode: '1230' },
          { nameBn: 'আব্দুল্লাহপুর (Abdullahpur)', nameEn: 'Abdullahpur', postCode: '1230' },
          { nameBn: 'তুরাগ (Turag)', nameEn: 'Turag', postCode: '1230' }
        ]
      },
      {
        nameBn: 'গুলশান ও বনানী (Gulshan & Banani)',
        nameEn: 'Gulshan & Banani',
        lat: 23.7937,
        lng: 90.4066,
        unions: [
          { nameBn: 'গুলশান ১ (সার্কেল ১)', nameEn: 'Gulshan 1', postCode: '1212' },
          { nameBn: 'গুলশান ২ (ডিপ্লোমেটিক জোন)', nameEn: 'Gulshan 2', postCode: '1212' },
          { nameBn: 'বনানী (১১ নম্বর রোড)', nameEn: 'Banani', postCode: '1213' },
          { nameBn: 'বারিধারা ডিপ্লোমেটিক জোন', nameEn: 'Baridhara', postCode: '1212' },
          { nameBn: 'বারিধারা ডিওএইচএস (DOHS)', nameEn: 'Baridhara DOHS', postCode: '1206' },
          { nameBn: 'মহাখালী (ফ্লাইওভার ও ওয়ারলেস)', nameEn: 'Mohakhali', postCode: '1212' },
          { nameBn: 'মহাখালী ডিওএইচএস', nameEn: 'Mohakhali DOHS', postCode: '1206' },
          { nameBn: 'নিকেতন (Niketon)', nameEn: 'Niketon', postCode: '1212' }
        ]
      },
      {
        nameBn: 'ধানমন্ডি ও কলাবাগান (Dhanmondi)',
        nameEn: 'Dhanmondi',
        lat: 23.7538,
        lng: 90.3770,
        unions: [
          { nameBn: 'ধানমন্ডি ২৭ (শংকর)', nameEn: 'Dhanmondi 27', postCode: '1209' },
          { nameBn: 'ধানমন্ডি ৩২ (লেকরোড)', nameEn: 'Dhanmondi 32', postCode: '1209' },
          { nameBn: 'ধানমন্ডি ৮/এ ও জিগাতলা', nameEn: 'Jigatola', postCode: '1209' },
          { nameBn: 'ধানমন্ডি ২ ও সাইন্সল্যাব', nameEn: 'Science Lab', postCode: '1205' },
          { nameBn: 'কলাবাগান ও কাঁঠালবাগান', nameEn: 'Kalabagan', postCode: '1205' },
          { nameBn: 'গ্রিনরোড ও পান্থপথ', nameEn: 'Panthapath', postCode: '1205' },
          { nameBn: 'সোবহানবাগ ও শুক্রাবাদ', nameEn: 'Sukrabad', postCode: '1207' }
        ]
      },
      {
        nameBn: 'মোহাম্মদপুর ও আদাবর (Mohammadpur)',
        nameEn: 'Mohammadpur',
        lat: 23.7658,
        lng: 90.3584,
        unions: [
          { nameBn: 'মোহাম্মদপুর বাসস্ট্যান্ড ও টাউনহল', nameEn: 'Town Hall', postCode: '1207' },
          { nameBn: 'রিং রোড ও শ্যামলী', nameEn: 'Shyamoli', postCode: '1207' },
          { nameBn: 'আসাদগেট ও বাবর রোড', nameEn: 'Asad Gate', postCode: '1207' },
          { nameBn: 'নূরজাহান রোড ও তাজমহল রোড', nameEn: 'Tajmahal Road', postCode: '1207' },
          { nameBn: 'বসিলা ও বসিলা সিটি', nameEn: 'Bosila', postCode: '1207' },
          { nameBn: 'আদাবর ও শেকেরটেক', nameEn: 'Adabor', postCode: '1207' },
          { nameBn: 'মনসুরাবাদ ও জাপান গার্ডেন সিটি', nameEn: 'Japan Garden City', postCode: '1207' }
        ]
      },
      {
        nameBn: 'বাড্ডা ও ভাটারা (Badda & Bhatara)',
        nameEn: 'Badda',
        lat: 23.7845,
        lng: 90.4285,
        unions: [
          { nameBn: 'মধ্য বাড্ডা ও উত্তর বাড্ডা', nameEn: 'Middle Badda', postCode: '1212' },
          { nameBn: 'নতুন বাজার ও গুলশান লিংক', nameEn: 'Notun Bazar', postCode: '1212' },
          { nameBn: 'ভাটারা ও বসুন্ধরা আবাসিক (গেট ১-৩)', nameEn: 'Bashundhara R/A', postCode: '1229' },
          { nameBn: 'বসুন্ধরা ব্লক এ-এম (আই ব্লক)', nameEn: 'Bashundhara Ext.', postCode: '1229' },
          { nameBn: 'কুড়িল ও কুড়িল বিশ্বরোড', nameEn: 'Kuril Flyover', postCode: '1229' },
          { nameBn: 'সাতারকুল ও বেরাইদ', nameEn: 'Satarkul', postCode: '1212' }
        ]
      },
      {
        nameBn: 'মতিঝিল ও পল্টন (Motijheel & Paltan)',
        nameEn: 'Motijheel',
        lat: 23.7330,
        lng: 90.4170,
        unions: [
          { nameBn: 'মতিঝিল বাণিজ্যিক এলাকা (C/A)', nameEn: 'Motijheel C/A', postCode: '1000' },
          { nameBn: 'নয়া পল্টন ও পুরানা পল্টন', nameEn: 'Naya Paltan', postCode: '1000' },
          { nameBn: 'দিলকুশা ও দৈনিক বাংলা', nameEn: 'Dilkusha', postCode: '1000' },
          { nameBn: 'ফকিরাপুল ও আরামবাগ', nameEn: 'Fakirapool', postCode: '1000' },
          { nameBn: 'কমলাপুর রেলওয়ে স্টেশন জোন', nameEn: 'Kamalapur', postCode: '1217' },
          { nameBn: 'কাকরাইল ও বিজয়নগর', nameEn: 'Kakrail', postCode: '1000' }
        ]
      },
      {
        nameBn: 'তেজগাঁও ও মগবাজার (Tejgaon)',
        nameEn: 'Tejgaon',
        lat: 23.7628,
        lng: 90.3984,
        unions: [
          { nameBn: 'তেজগাঁও শিল্প এলাকা (I/A)', nameEn: 'Tejgaon I/A', postCode: '1208' },
          { nameBn: 'মগবাজার ও ওয়্যারলেস মোড়', nameEn: 'Moghbazar', postCode: '1217' },
          { nameBn: 'কারওয়ান বাজার ও এফডিসি', nameEn: 'Kawran Bazar', postCode: '1215' },
          { nameBn: 'ফার্মগেট ও ইন্দিরা রোড', nameEn: 'Farmgate', postCode: '1215' },
          { nameBn: 'মৌচাক ও মালিবাগ মোড়', nameEn: 'Mouchak', postCode: '1217' },
          { nameBn: 'শান্তিনগর ও বেইলি রোড', nameEn: 'Shantinagar', postCode: '1217' }
        ]
      },
      {
        nameBn: 'সাভার ও আশুলিয়া (Savar & Ashulia)',
        nameEn: 'Savar',
        lat: 23.8583,
        lng: 90.2667,
        unions: [
          { nameBn: 'সাভার পৌরসভা ও বাজার', nameEn: 'Savar Bazar', postCode: '1340' },
          { nameBn: 'সাভার ক্যান্টনমেন্ট (Savar Cantt)', nameEn: 'Savar Cantt', postCode: '1344' },
          { nameBn: 'আশুলিয়া ও বাইপাইল', nameEn: 'Ashulia', postCode: '1341' },
          { nameBn: 'ডিইপিজেড (DEPZ) ও নবীনগর', nameEn: 'DEPZ / Nabinagar', postCode: '1349' },
          { nameBn: 'জিরাবো ও জামগড়া', nameEn: 'Zirabo', postCode: '1341' },
          { nameBn: 'হেমায়েতপুর (Hemayetpur)', nameEn: 'Hemayetpur', postCode: '1340' },
          { nameBn: 'আমিনবাজার (Aminbazar)', nameEn: 'Aminbazar', postCode: '1348' }
        ]
      },
      {
        nameBn: 'কেরানীগঞ্জ (Keraniganj)',
        nameEn: 'Keraniganj',
        lat: 23.6845,
        lng: 90.3125,
        unions: [
          { nameBn: 'কদমতলী ও জিনজিরা', nameEn: 'Zinzira', postCode: '1310' },
          { nameBn: 'হাসনাবাদ ও পোস্তগোলা ব্রিজ', nameEn: 'Hasnabad', postCode: '1311' },
          { nameBn: 'রোহিতপুর ও আটিবাজার', nameEn: 'Atibazar', postCode: '1312' }
        ]
      }
    ]
  },
  {
    id: 'gazipur',
    nameBn: 'গাজীপুর',
    nameEn: 'Gazipur',
    divisionBn: 'ঢাকা',
    divisionEn: 'Dhaka',
    lat: 24.0023,
    lng: 90.4264,
    upazilas: [
      {
        nameBn: 'গাজীপুর সদর ও চান্দনা চৌরাস্তা',
        nameEn: 'Gazipur Sadar',
        lat: 24.0023,
        lng: 90.4264,
        unions: [
          { nameBn: 'চান্দনা চৌরাস্তা ও জয়দেবপুর', nameEn: 'Chandana Chowrasta', postCode: '1700' },
          { nameBn: 'শিববাড়ি মোড় ও রাজবাড়ী রোড', nameEn: 'Shibbari', postCode: '1700' },
          { nameBn: 'সালনা ও পোড়াবাড়ী', nameEn: 'Salna', postCode: '1703' },
          { nameBn: 'বোর্ড বাজার ও জাতীয় বিশ্ববিদ্যালয়', nameEn: 'Board Bazar', postCode: '1704' },
          { nameBn: 'ভোগড়া বাইপাস মোড়', nameEn: 'Bhogra Bypass', postCode: '1704' }
        ]
      },
      {
        nameBn: 'টঙ্গী (Tongi)',
        nameEn: 'Tongi',
        lat: 23.8983,
        lng: 90.4042,
        unions: [
          { nameBn: 'টঙ্গী স্টেশন রোড ও বাজার', nameEn: 'Tongi Bazar', postCode: '1710' },
          { nameBn: 'চেরাগ আলী ও কলেজ গেট', nameEn: 'Cherag Ali', postCode: '1711' },
          { nameBn: 'গাজীপুরা ও হোসেন মার্কেট', nameEn: 'Gazipura', postCode: '1712' },
          { nameBn: 'আউচপাড়া ও খাঁ-পাড়া', nameEn: 'Auchpara', postCode: '1711' }
        ]
      },
      {
        nameBn: 'কালিয়াকৈর (Kaliakair)',
        nameEn: 'Kaliakair',
        lat: 24.0750,
        lng: 90.2167,
        unions: [
          { nameBn: 'কালিয়াকৈর পৌরসভা ও বাজার', nameEn: 'Kaliakair', postCode: '1750' },
          { nameBn: 'চন্দ্রা মোড় ও কালিয়াকৈর হাইটেক পার্ক', nameEn: 'Chandra More', postCode: '1751' },
          { nameBn: 'মৌচাক ও সফিপুর', nameEn: 'Mouchak', postCode: '1751' }
        ]
      },
      {
        nameBn: 'শ্রীপুর (Sreepur)',
        nameEn: 'Sreepur',
        lat: 24.2000,
        lng: 90.4833,
        unions: [
          { nameBn: 'মাওনা চৌরাস্তা ও শ্রীপুর সদর', nameEn: 'Mawna Chowrasta', postCode: '1740' },
          { nameBn: 'বরমী ও তেলিহাটি', nameEn: 'Bormi', postCode: '1743' }
        ]
      }
    ]
  },
  {
    id: 'narayanganj',
    nameBn: 'নারায়ণগঞ্জ',
    nameEn: 'Narayanganj',
    divisionBn: 'ঢাকা',
    divisionEn: 'Dhaka',
    lat: 23.6238,
    lng: 90.5000,
    upazilas: [
      {
        nameBn: 'নারায়ণগঞ্জ সদর (Sadar)',
        nameEn: 'Narayanganj Sadar',
        lat: 23.6238,
        lng: 90.5000,
        unions: [
          { nameBn: 'চাষাড়া ও ২ নম্বর রেলগেট', nameEn: 'Chashara', postCode: '1400' },
          { nameBn: 'নিতাইগঞ্জ ও টানবাজার', nameEn: 'Nitaiganj', postCode: '1400' },
          { nameBn: 'ফতুল্লা ও পঞ্চবটী', nameEn: 'Fatullah', postCode: '1420' },
          { nameBn: 'সিদ্ধিরগঞ্জ ও সাইনবোর্ড মোড়', nameEn: 'Siddhirganj', postCode: '1430' },
          { nameBn: 'শিমরাইল ও চিটাগাং রোড', nameEn: 'Shimrail', postCode: '1430' }
        ]
      },
      {
        nameBn: 'সোনারগাঁও (Sonargaon)',
        nameEn: 'Sonargaon',
        lat: 23.6450,
        lng: 90.6000,
        unions: [
          { nameBn: 'মোগরাপাড়া চৌরাস্তা', nameEn: 'Mograpara', postCode: '1440' },
          { nameBn: 'কাঁচপুর ও মদনপুর বাসস্ট্যান্ড', nameEn: 'Kanchpur', postCode: '1430' }
        ]
      },
      {
        nameBn: 'রূপগঞ্জ (Rupganj)',
        nameEn: 'Rupganj',
        lat: 23.7850,
        lng: 90.5200,
        unions: [
          { nameBn: 'ভুলতা ও গাউছিয়া মার্কেট', nameEn: 'Bhulta / Gawsia', postCode: '1462' },
          { nameBn: 'কাঞ্চন ব্রিজ ও পূর্বাচল ৩-৩০ সেক্টর', nameEn: 'Purbachal', postCode: '1460' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // CHATTOGRAM DIVISION
  // -------------------------------------------------------------
  {
    id: 'chattogram',
    nameBn: 'চট্টগ্রাম',
    nameEn: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    lat: 22.3569,
    lng: 91.7832,
    upazilas: [
      {
        nameBn: 'কোতোয়ালী ও জিইসি (Central Metro)',
        nameEn: 'Central Chattogram',
        lat: 22.3569,
        lng: 91.7832,
        unions: [
          { nameBn: 'জিইসি মোড় ও গোলপাহাড়', nameEn: 'GEC Circle', postCode: '4000' },
          { nameBn: 'আগ্রাবাদ বাণিজ্যিক এলাকা (C/A)', nameEn: 'Agrabad C/A', postCode: '4100' },
          { nameBn: 'নিউ মার্কেট ও আন্দরকিল্লা', nameEn: 'Andarkilla', postCode: '4000' },
          { nameBn: 'মুরাদপুর ও ২ নম্বর গেট', nameEn: 'Muradpur', postCode: '4203' },
          { nameBn: 'চকবাজার ও লালখান বাজার', nameEn: 'Chawkbazar', postCode: '4203' },
          { nameBn: 'নাসিরাবাদ ও খুলশী', nameEn: 'Khulshi', postCode: '4225' },
          { nameBn: 'হালিশহর ও পতেঙ্গা সি-বীচ রোড', nameEn: 'Halishahar', postCode: '4216' },
          { nameBn: 'পাহাড়তলী ও অলংকার মোড়', nameEn: 'Pahartali', postCode: '4202' }
        ]
      },
      {
        nameBn: 'সীতাকুণ্ড (Sitakunda)',
        nameEn: 'Sitakunda',
        lat: 22.6167,
        lng: 91.6667,
        unions: [
          { nameBn: 'কুমিরা ও ভাটিয়ারী', nameEn: 'Bhatiari', postCode: '4315' },
          { nameBn: 'সীতাকুণ্ড সদর বাজার', nameEn: 'Sitakunda Bazar', postCode: '4310' },
          { nameBn: 'বার আউলিয়া ও ফৌজদারহাট', nameEn: 'Faujdarhat', postCode: '4313' }
        ]
      },
      {
        nameBn: 'পটিয়া (Patiya)',
        nameEn: 'Patiya',
        lat: 22.2950,
        lng: 91.9800,
        unions: [
          { nameBn: 'পটিয়া পৌরসভা ও ডাকবাংলো মোড়', nameEn: 'Patiya', postCode: '4370' },
          { nameBn: 'মনসা ও শান্তিরহাট', nameEn: 'Shantirhat', postCode: '4371' }
        ]
      },
      {
        nameBn: 'হাটহাজারী (Hathazari)',
        nameEn: 'Hathazari',
        lat: 22.5083,
        lng: 91.8083,
        unions: [
          { nameBn: 'চট্টগ্রাম বিশ্ববিদ্যালয় (CU Campus)', nameEn: 'CU Campus', postCode: '4331' },
          { nameBn: 'হাটহাজারী বাসস্ট্যান্ড ও বাজার', nameEn: 'Hathazari Bazar', postCode: '4330' }
        ]
      }
    ]
  },
  {
    id: 'coxs_bazar',
    nameBn: 'কক্সবাজার',
    nameEn: 'Cox\'s Bazar',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    lat: 21.4272,
    lng: 92.0058,
    upazilas: [
      {
        nameBn: 'কক্সবাজার সদর (Sadar)',
        nameEn: 'Cox\'s Bazar Sadar',
        lat: 21.4272,
        lng: 92.0058,
        unions: [
          { nameBn: 'কলাতলী সুগন্ধা পয়েন্ট ও বিচ রোড', nameEn: 'Kolatoli Beach', postCode: '4700' },
          { nameBn: 'লাবণী পয়েন্ট ও ঝাউতলা', nameEn: 'Laboni Point', postCode: '4700' },
          { nameBn: 'বাজারঘাটা ও লালদীঘি', nameEn: 'Bazarghata', postCode: '4700' }
        ]
      },
      {
        nameBn: 'উখিয়া ও টেকনাফ (Ukhiya & Teknaf)',
        nameEn: 'Ukhiya',
        lat: 21.2833,
        lng: 92.1167,
        unions: [
          { nameBn: 'কোটবাজার ও উখিয়া সদর', nameEn: 'Kotbazar', postCode: '4750' },
          { nameBn: 'টেকনাফ মেরিন ড্রাইভ রোড', nameEn: 'Teknaf Marine Drive', postCode: '4760' }
        ]
      }
    ]
  },
  {
    id: 'cumilla',
    nameBn: 'কুমিল্লা',
    nameEn: 'Cumilla',
    divisionBn: 'চট্টগ্রাম',
    divisionEn: 'Chattogram',
    lat: 23.4682,
    lng: 91.1788,
    upazilas: [
      {
        nameBn: 'কুমিল্লা আদর্শ সদর (Kandirpar)',
        nameEn: 'Cumilla Sadar',
        lat: 23.4682,
        lng: 91.1788,
        unions: [
          { nameBn: 'কান্দিরপাড় ও রাজগঞ্জ', nameEn: 'Kandirpar', postCode: '3500' },
          { nameBn: 'শাসনগাছা বাস টার্মিনাল', nameEn: 'Shashongacha', postCode: '3500' },
          { nameBn: 'পদুয়ার বাজার বিশ্বরোড মোড়', nameEn: 'Paduar Bazar', postCode: '3500' },
          { nameBn: 'কোটবাড়ি ও শালবন বিহার', nameEn: 'Kotbari', postCode: '3503' }
        ]
      },
      {
        nameBn: 'দাউদকান্দি ও চান্দিনা',
        nameEn: 'Daudkandi',
        lat: 23.5333,
        lng: 90.7167,
        unions: [
          { nameBn: 'দাউদকান্দি টোলপ্লাজা ও বাজার', nameEn: 'Daudkandi', postCode: '3516' },
          { nameBn: 'গৌরীপুর বাজার ও চান্দিনা', nameEn: 'Gouripur', postCode: '3517' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // SYLHET DIVISION
  // -------------------------------------------------------------
  {
    id: 'sylhet',
    nameBn: 'সিলেট',
    nameEn: 'Sylhet',
    divisionBn: 'সিলেট',
    divisionEn: 'Sylhet',
    lat: 24.8949,
    lng: 91.8687,
    upazilas: [
      {
        nameBn: 'সিলেট সদর ও সিটি কর্পোরেশন',
        nameEn: 'Sylhet Metro',
        lat: 24.8949,
        lng: 91.8687,
        unions: [
          { nameBn: 'জিন্দাবাজার ও চৌহাট্টা', nameEn: 'Zindabazar', postCode: '3100' },
          { nameBn: 'আম্বরখানা ও দরগাহ গেট (হযরত শাহজালাল র.)', nameEn: 'Amborkhana', postCode: '3100' },
          { nameBn: 'বন্দরবাজার ও কোর্ট পয়েন্ট', nameEn: 'Bondorbazar', postCode: '3100' },
          { nameBn: 'সুবিদবাজার ও শাহী ঈদগাহ', nameEn: 'Subidbazar', postCode: '3100' },
          { nameBn: 'টিলাগড় ও উপশহর', nameEn: 'Tilagor', postCode: '3100' },
          { nameBn: 'কদমতলী বাস টার্মিনাল ও রেল স্টেশন', nameEn: 'Kodomtoli', postCode: '3100' },
          { nameBn: 'কুমারগাঁও বাস টার্মিনাল ও শাবিপ্রবি (SUST)', nameEn: 'SUST Campus', postCode: '3114' }
        ]
      },
      {
        nameBn: 'গোলাপগঞ্জ ও বিয়ানীবাজার',
        nameEn: 'Golapganj',
        lat: 24.8500,
        lng: 92.0167,
        unions: [
          { nameBn: 'গোলাপগঞ্জ চৌমুহনী ও বাজার', nameEn: 'Golapganj', postCode: '3160' },
          { nameBn: 'বিয়ানীবাজার পৌরসভা ও সদর', nameEn: 'Beanibazar', postCode: '3170' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // RAJSHAHI DIVISION
  // -------------------------------------------------------------
  {
    id: 'rajshahi',
    nameBn: 'রাজশাহী',
    nameEn: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    lat: 24.3636,
    lng: 88.6241,
    upazilas: [
      {
        nameBn: 'বোয়ালিয়া ও সদর মেট্রো (Rajshahi City)',
        nameEn: 'Boalia',
        lat: 24.3636,
        lng: 88.6241,
        unions: [
          { nameBn: 'সাহেব বাজার ও জিরো পয়েন্ট', nameEn: 'Saheb Bazar', postCode: '6000' },
          { nameBn: 'নিউ মার্কেট ও রেলগেট', nameEn: 'Railgate', postCode: '6000' },
          { nameBn: 'বিন্দু জামান চত্বর ও তালাইমারী', nameEn: 'Talaimari', postCode: '6204' },
          { nameBn: 'রাজশাহী বিশ্ববিদ্যালয় (RU Campus)', nameEn: 'RU Campus', postCode: '6205' },
          { nameBn: 'কোট চত্বর ও লক্ষ্মীপুর মোড়', nameEn: 'Laxmipur', postCode: '6000' }
        ]
      }
    ]
  },
  {
    id: 'bogura',
    nameBn: 'বগুড়া',
    nameEn: 'Bogura',
    divisionBn: 'রাজশাহী',
    divisionEn: 'Rajshahi',
    lat: 24.8465,
    lng: 89.3730,
    upazilas: [
      {
        nameBn: 'বগুড়া সদর (Sadar)',
        nameEn: 'Bogura Sadar',
        lat: 24.8465,
        lng: 89.3730,
        unions: [
          { nameBn: 'সাতমাথা ও নিউ মার্কেট', nameEn: 'Satmatha', postCode: '5800' },
          { nameBn: 'চারমাথা সেন্ট্রাল বাস টার্মিনাল', nameEn: 'Charmatha', postCode: '5800' },
          { nameBn: 'বনানী বাইপাস মোড়', nameEn: 'Banani More', postCode: '5800' },
          { nameBn: 'মাটিডালী বিমান মোড়', nameEn: 'Matidali', postCode: '5800' }
        ]
      },
      {
        nameBn: 'শেরপুর ও শেরুয়া (Sherpur)',
        nameEn: 'Sherpur',
        lat: 24.6667,
        lng: 89.4167,
        unions: [
          { nameBn: 'শেরপুর বাসস্ট্যান্ড ও কলেজ মোড়', nameEn: 'Sherpur', postCode: '5840' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // KHULNA DIVISION
  // -------------------------------------------------------------
  {
    id: 'khulna',
    nameBn: 'খুলনা',
    nameEn: 'Khulna',
    divisionBn: 'খুলনা',
    divisionEn: 'Khulna',
    lat: 22.8456,
    lng: 89.5403,
    upazilas: [
      {
        nameBn: 'খুলনা সদর ও সোনাডাঙ্গা মেট্রো',
        nameEn: 'Khulna Metro',
        lat: 22.8456,
        lng: 89.5403,
        unions: [
          { nameBn: 'শিববাড়ি মোড় ও ময়লাপোতা', nameEn: 'Shibbari', postCode: '9000' },
          { nameBn: 'সোনাডাঙ্গা সেন্ট্রাল বাস টার্মিনাল', nameEn: 'Sonadanga', postCode: '9100' },
          { nameBn: 'দৌলতপুর ও খালিশপুর', nameEn: 'Daulatpur', postCode: '9202' },
          { nameBn: 'রূপসা ফেরিঘাট ও ব্রিজ মোড়', nameEn: 'Rupsha', postCode: '9240' }
        ]
      },
      {
        nameBn: 'যশোর (Jashore Link / Sadar)',
        nameEn: 'Jashore Link',
        lat: 23.1667,
        lng: 89.2167,
        unions: [
          { nameBn: 'মনিহার মোড় ও দড়াটানা', nameEn: 'Monihar', postCode: '7400' },
          { nameBn: 'নওয়াপাড়া ও ফুলতলা', nameEn: 'Nawapara', postCode: '7460' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // BARISHAL DIVISION
  // -------------------------------------------------------------
  {
    id: 'barishal',
    nameBn: 'বরিশাল',
    nameEn: 'Barishal',
    divisionBn: 'বরিশাল',
    divisionEn: 'Barishal',
    lat: 22.7010,
    lng: 90.3535,
    upazilas: [
      {
        nameBn: 'বরিশাল সদর ও কোতোয়ালী',
        nameEn: 'Barishal Sadar',
        lat: 22.7010,
        lng: 90.3535,
        unions: [
          { nameBn: 'সদর রোড ও চকবাজার', nameEn: 'Sadar Road', postCode: '8200' },
          { nameBn: 'নথুল্লাবাদ কেন্দ্রীয় বাস টার্মিনাল', nameEn: 'Nothullabad', postCode: '8200' },
          { nameBn: 'রূপাতলী বাস টার্মিনাল', nameEn: 'Rupatali', postCode: '8200' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // RANGPUR DIVISION
  // -------------------------------------------------------------
  {
    id: 'rangpur',
    nameBn: 'রংপুর',
    nameEn: 'Rangpur',
    divisionBn: 'রংপুর',
    divisionEn: 'Rangpur',
    lat: 25.7439,
    lng: 89.2752,
    upazilas: [
      {
        nameBn: 'রংপুর সদর মেট্রো (Sadar)',
        nameEn: 'Rangpur Sadar',
        lat: 25.7439,
        lng: 89.2752,
        unions: [
          { nameBn: 'জাহাজ কোম্পানি মোড় ও পায়রা চত্বর', nameEn: 'Payra Chottor', postCode: '5400' },
          { nameBn: 'কামারপাড়া ঢাকা বাস টার্মিনাল', nameEn: 'Kamarpara', postCode: '5400' },
          { nameBn: 'মডার্ন মোড় ও বেগম রোকেয়া বিশ্ববিদ্যালয়', nameEn: 'Modern More', postCode: '5404' }
        ]
      }
    ]
  },

  // -------------------------------------------------------------
  // MYMENSINGH DIVISION
  // -------------------------------------------------------------
  {
    id: 'mymensingh',
    nameBn: 'ময়মনসিংহ',
    nameEn: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    divisionEn: 'Mymensingh',
    lat: 24.7471,
    lng: 90.4203,
    upazilas: [
      {
        nameBn: 'ময়মনসিংহ সদর ও কোতোয়ালী',
        nameEn: 'Mymensingh Sadar',
        lat: 24.7471,
        lng: 90.4203,
        unions: [
          { nameBn: 'গাঙ্গিনার পাড় ও টাউন হল', nameEn: 'Ganginarpar', postCode: '2200' },
          { nameBn: 'মাসকান্দা বাস টার্মিনাল', nameEn: 'Maskanda', postCode: '2200' },
          { nameBn: 'কৃষি বিশ্ববিদ্যালয় (BAU Campus)', nameEn: 'BAU Campus', postCode: '2202' }
        ]
      }
    ]
  }
];
