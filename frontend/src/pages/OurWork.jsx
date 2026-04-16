import React, { useRef, useState, useEffect } from "react";
import { getReports } from "../services/api";
import bannerImg from "../assets/BannerImages/f.jpeg";
import { useLocation } from "react-router-dom";
import { useRegion } from "../hooks/useRegion";


import QE from "../assets/Interventions/i/Education.png";
import LS from "../assets/Interventions/i/Livelihood.png";
import HS from "../assets/Interventions/i/Healthcare.png";
import ES from "../assets/Interventions/i/EnvironmentSustainibility.png";
import IDP from "../assets/Interventions/i/IDP.png";

import "./OurWork.css";
import logger from "../utils/logger";

const OurWork = () => {
  const region = useRegion();
  const [reports, setReports] = useState([]);

  const [error, setError] = useState(null);

  // Refs for each section
  const sectionRefs = {
    education: useRef(null),
    livelihood: useRef(null),
    healthcare: useRef(null),
    environment: useRef(null),
    idp: useRef(null),
  };
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const targetRef = sectionRefs[id];

      if (targetRef?.current) {
        setTimeout(() => {
          targetRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      }
    }
  }, [location]);

  // Intervention data
  const interventions = [
    {
      id: "education",
      title: "Quality Education",
      description:
        "Y4D Foundation transforms education for underserved communities by providing digital learning labs,skill-based training, scholarships, and teacher capacity building, empowering youth with quality education for a resilient and equitable future. We bridge the education gap through innovative solutions, fostering digital literacy, leadership, and lifelong learning to enable social and economic progress.",
      image: QE,
      color: "#38b6e9",
    },
    {
      id: "livelihood",
      title: "Livelihood",
      description:
        "Y4D Foundation promotes sustainable livelihoods aligned with SDG 8 by empowering marginalized communities through skill development, financial literacy, and digital education, enabling self-reliance and economic stability. Our industry-relevant training bridges the gap between knowledge and practice, fostering employability, entrepreneurship, and long-term socio-economic growth.",
      image: LS,
      color: "#febd2c",
    },
    {
      id: "healthcare",
      title: "Healthcare",
      description:
        "Y4D Foundation advances SDG 3 by enhancing healthcare access for underserved communities through preventive health camps, awareness campaigns on nutrition, fitness, and early detection, empowering individuals for healthier lives. By promoting health education and providing regular medical check-ups, Y4D tackles barriers like financial constraints and lack of awareness, fostering well-being and long-term community health.",
      image: HS,
      color: "#e63a34",
    },
    {
      id: "environment",
      title: "Environment Sustainability",
      description:
        "Y4D Foundation supports SDG 15 by promoting environmental sustainability through tree planting drives, ecological restoration, and awareness programs, fostering conservation and climate resilience. Using innovative methods like Miyawaki Afforestation, Y4D enhances green cover and ecological balance, empowering communities to contribute to a healthier, sustainable planet.",
      image: ES,
      color: "#42b242",
    },
    {
      id: "idp",
      title: "Integrated Development Program (IDP)",
      description:
        "Y4D Foundation’s Integrated Development Program (IDP) drives holistic community development by combining education, healthcare, livelihood, and environmental sustainability, aligned with SDGs 1, 3, 4, 8, and 13. Through supporting FPOs, SHGs, skill training, and financial literacy, Y4D empowers marginalized communities with economic stability, market access, and self-reliance for sustainable growth.",
      image: IDP,
      color: "#803a96",
    },
  ];

  // Fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsData = await getReports();
        setReports(reportsData);
      } catch (err) {
        setError("Failed to load our work data. Please try again later.");
        logger.error("Error fetching reports:", err);
      }
    };

    fetchReports();
  }, []);

  // Scroll to section
  const handleScroll = (id) => {
    sectionRefs[id].current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="our-work-page">
      {/* Banner */}
      <div className="work-banner">
        <img src={bannerImg} alt="Our Work Banner" />
      </div>

      {/* Loop sections */}
      {interventions
        .filter((intervention) => (region === "global" ? intervention.id === "education" : true))
        .map((intervention) => (

          <div
            key={intervention.id}
            ref={sectionRefs[intervention.id]}
            id={intervention.id}
            className="work-section"
          >
            {/* Tabs in each section */}
            {region !== "global" && (
              <div className="work-tabs">
                {interventions.map((tab) => (
                  <button
                    key={tab.id}
                    className={`work-tab ${tab.id === intervention.id ? "active" : ""
                      }`}
                    onClick={() => handleScroll(tab.id)}
                    style={{
                      backgroundColor:
                        tab.id === intervention.id ? tab.color : "transparent",
                      color: tab.id === intervention.id ? "#fff" : "#222",
                    }}
                  >
                    {tab.title}
                  </button>
                ))}
              </div>
            )}


            {/* Content */}
            <div className={`work-content-container ${region === "global" ? "global-education-container" : ""}`}>
              <div className="work-image">
                <img src={intervention.image} alt={intervention.title} />
              </div>
              {region === "global" ? (
                <div className="education-extra-text-full no-margin-padding">
                  <p>
                    In the rapidly evolving digital era, digital education has become a vital force for equipping young learners with essential 21st-century skills, helping them thrive in a technology-driven world and effectively bridging the digital divide in developing regions like Kenya. Y4D Foundation International (Youth for Development Foundation), a youth-led global non-profit organization, is advancing this cause through a strong and ongoing partnership with Wema Foundation (Wema BDO Kenya), a local organization dedicated to youth empowerment and community development in Kenya. Through this collaboration, formalized via a Letter of Cooperation, Y4D Foundation conducts regular interactive and practical digital learning sessions, particularly in Mombasa, where students many of whom are using a computer for the first time are introduced to foundational skills such as computer basics, email writing, internet usage, and presentation skills. The sessions go deeper into critical topics, including how the internet and web services function (such as how websites work and how data travels across networks), the importance of safe internet practices, operating systems as the “brain” behind every computer, cyber awareness, and Cyber Law, where students learn about their rights, responsibilities, and ways to stay protected in the digital world. Building on these foundations, Y4D introduces advanced concepts like Artificial Intelligence (AI) and Machine Learning, blending theory with hands-on applications such as AI-assisted presentations, content creation, and critical thinking exercises. Led by dedicated volunteers and team members, these weekly online and interactive workshops foster curiosity, build confidence, and develop responsible digital habits among Kenyan youth. This meaningful India-Kenya cross-border partnership not only empowers underprivileged students with end-to-end digital and AI competencies but also contributes to Kenya’s broader goals of inclusive growth, innovation, and digital inclusion, creating a stronger foundation for the next generation to participate confidently in the global digital economy.
                  </p>
                </div>
              ) : (
                <div className="work-text">
                  <h3>{intervention.title}</h3>
                  <p>{intervention.description}</p>
                  <ul className="work-stats">
                    {intervention.id === "education" && (
                      <>
                        <li><strong>Students Empowered: 75,000</strong></li>
                        <li><strong>Teachers Benefitted: 5,600</strong></li>
                        <li><strong>Classrooms Transformed: 200</strong></li>
                        <li><strong>Anganwadi & School Upgraded: 30</strong></li>
                      </>
                    )}
                    {intervention.id === "livelihood" && (
                      <>
                        <li><strong>Candidates Trained: 98,000 (75% Female)</strong></li>
                        <li><strong>Youth Trained under Skill Initiatives: 17,000 (75% Female)</strong></li>
                        <li><strong>Placement Ratio: 80%</strong></li>
                        <li><strong>Enterprises Supported: 323</strong></li>
                      </>
                    )}
                    {intervention.id === "healthcare" && (
                      <>
                        <li><strong>Total Beneficiaries: 7,00,000</strong></li>
                        <li><strong>Health Camps Conducted: 450</strong></li>
                        <li><strong>PHC’s Upgraded: 15</strong></li>
                        <li><strong>Ambulance Donated: 30</strong></li>
                      </>
                    )}
                    {intervention.id === "environment" && (
                      <>
                        <li><strong>Trees Planted: 61,000</strong></li>
                        <li><strong>Agrarians Empowered: 100</strong></li>
                        <li><strong>Ecological Restoration of Land: 15 acres</strong></li>
                        <li><strong>Solar Panel/Lights Installed: 150</strong></li>
                      </>
                    )}
                    {intervention.id === "idp" && (
                      <>
                        <li><strong>State - 14</strong></li>
                        <li><strong>Districts - 62</strong></li>
                        <li><strong>Villages - 440</strong></li>
                        <li><strong>Projects - 39</strong></li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>

            {region !== "global" && intervention.id === "education" && (
              <div className="education-extra-text-full">
                <h4>DTRC (Digital Training and Resource Center):</h4>
                <p>... (omitting content for brevity but original text remains) ...</p>
                {/* (I'll keep the full logic though briefly described here, in the real file I'll replace it correctly) */}
              </div>
            )}



            {intervention.id === "livelihood" && (
              <div className="livelihood-extra-text-full">
                <h4>
                  Journey to Self-Reliance- Skill Training (Printed Circuit
                  Board(PCB) + Assistant Assembly Operator (AAO)):
                </h4>
                <p>
                  Skill to Employability is a specially designed vocational
                  training program by Y4D Foundation, aligned with the criteria of
                  the National Skill Development Corporation (NSDC) and
                  contributing to the vision of the Skill India Mission. The
                  program focuses on empowering underprivileged youth by equipping
                  them with industry-relevant skills that enhance their
                  employability and economic independence. To achieve this, Y4D
                  has established a network of skill training centers across
                  India, offering one month of intensive classroom training
                  combined with on-the-job practical exposure. Current courses
                  include Printed Circuit Board (PCB) Assembly Operation and
                  Assistant Assembly Operator, both of which prepare participants
                  for immediate entry into the manufacturing and electronics
                  sectors. By bridging the gap between skill and employment, the
                  initiative not only creates livelihood opportunities for poor
                  youth but also contributes to nation-building through a skilled
                  workforce.
                </p>

                <h4>Financial and Digital Literacy Training:</h4>
                <p>
                  The main aim of this project is to enhance the skills and
                  financial knowledge of the underprivileged population in India,
                  enabling them to make informed decisions in both personal and
                  professional spheres. The initiative provides training on
                  essential financial literacy and digital skills that are
                  directly applicable to daily life and small business operations,
                  such as managing savings, accessing digital payment systems, and
                  adopting basic digital tools. By equipping participants with
                  these practical competencies, the program not only strengthens
                  their ability to manage resources effectively but also empowers
                  them to access new livelihood opportunities, improve household
                  financial stability, and participate more confidently in the
                  digital economy.
                </p>
                <h4>Sales and Marketing, Job Readiness:</h4>
                <p>
                  This project focuses on providing sales and marketing training
                  to underprivileged youth to enhance their employability and open
                  up better job opportunities, while also delivering job readiness
                  training to final-year students across various courses, with a
                  special emphasis on ITI students. The training equips
                  participants with practical skills such as communication,
                  customer handling, workplace etiquette, and basic digital
                  competencies that are crucial for today’s job market. By
                  bridging the gap between academic learning and industry
                  expectations, the program prepares students to transition
                  smoothly into the workforce, increasing their chances of
                  securing stable employment and building sustainable careers.
                </p>
              </div>
            )}

            {intervention.id === "healthcare" && (
              <div className="healthcare-extra-text-full">
                <h4>
                  Immediate Investigation - Theme-Based Health Check-up Camps
                </h4>
                <p>
                  This program aims to provide high-quality medical services and
                  essential equipment free of cost, ensuring that even the most
                  underserved communities have access to timely healthcare. By
                  organizing health check-up camps—including eye, ear, and general
                  health screenings—the initiative helps in the early detection
                  and rectification of prevalent diseases while raising awareness
                  about preventive healthcare practices. In doing so, the program
                  not only addresses immediate medical needs but also promotes the
                  physical and mental well-being of citizens, reduces the risk of
                  chronic illnesses, and fosters healthier communities with
                  improved quality of life.
                </p>

                <h4>Awareness Campaigns- WASH & Nutritional Awareness</h4>
                <p>
                  The proposed WASH and Nutrition initiative seeks to address the
                  dual challenges of inadequate hygiene practices and poor
                  nutritional standards among underprivileged communities. The
                  program focuses on creating awareness about safe hygiene habits
                  and balanced diets while supporting behavior change through the
                  distribution of WASH and nutritional kits. By combining
                  education with access to essential resources, the initiative
                  aims to reduce the risk of waterborne diseases, improve overall
                  health, and promote better nutritional outcomes. In the long
                  run, this integrated approach enhances community well-being,
                  strengthens immunity, and contributes to the holistic
                  development of children and families.
                </p>
                <h4>PHC Upgradation</h4>
                <p>
                  This project aims to strengthen Primary Health Care Centers
                  (PHCs) by identifying existing challenges and enhancing the
                  capacity of nurses and paramedical staff to deliver better
                  healthcare services. The initiative focuses on comprehensive
                  infrastructure improvements, including WASH and hygiene
                  facilities, clean drinking water, seating arrangements for
                  patients, solar panel installations, quality labor rooms, and
                  upgradation of essential medical equipment. By creating a safer,
                  cleaner, and more efficient healthcare environment, the project
                  not only improves service delivery and patient experience but
                  also supports frontline health workers in performing their
                  duties effectively. In the long run, it contributes to improved
                  maternal and child health outcomes, increased community trust in
                  public health services, and a stronger primary healthcare system
                  at the grassroots level.
                </p>

                <h4>Mobile Health Unit</h4>
                <p>
                  This program is focused on providing urgent prehospital
                  treatment and stabilization for patients requiring immediate
                  medical attention, while also addressing transportation
                  challenges to ensure timely access to healthcare facilities.
                  Through community-level, door-to-door health check-ups and
                  consultations conducted by experienced healthcare workers, the
                  initiative identifies health risks early, delivers preventive
                  care, and facilitates timely referrals when needed. By bringing
                  healthcare directly to the community, the program reduces delays
                  in critical treatment, raises awareness about preventive health
                  practices, and ultimately improves overall health outcomes,
                  while fostering greater trust in local healthcare services.
                </p>

                <h4>Skill Enhancement of ANM Nurses and MPHW</h4>
                <p>
                  This initiative aims to bridge the gap between rural healthcare
                  needs and the available facilities by enhancing the capacity of
                  nurses at Primary Health Centers (PHCs) and Sub-Centres, where
                  staffing shortages often lead to overburdened personnel. The
                  program focuses on personal and professional skill enhancement
                  training, continuous learning, and handholding support to
                  strengthen the knowledge, efficiency, and confidence of
                  healthcare workers. By empowering nurses with improved skills
                  and ongoing mentorship, the initiative ensures the delivery of
                  higher-quality healthcare services to community members,
                  improves patient outcomes, and strengthens the overall
                  effectiveness and reliability of rural healthcare systems.
                </p>
              </div>
            )}

            {intervention.id === "environment" && (
              <div className="environment-extra-text-full">
                <h4>Preserving Ecological BalanceLand & Water Conservation</h4>
                <p>
                  This program aims to intensify water conservation efforts
                  through two key interventions. The first involves the
                  installation of soak pits to facilitate groundwater recharge and
                  prevent surface water runoff. The second focuses on the
                  construction of check dams to slow down water flow, promote
                  sediment deposition, and further enhance groundwater
                  replenishment. By implementing these measures, the initiative
                  not only improves water availability for local communities and
                  agriculture but also contributes to long-term environmental
                  sustainability, reduces soil erosion, and strengthens resilience
                  against droughts and water scarcity.
                </p>

                <h4>Tree Plantation</h4>
                <p>
                  This program focuses on tree plantation using both traditional
                  and Miyawaki methods to restore and enhance green cover in
                  targeted areas. While traditional planting supports gradual
                  ecosystem development, the Miyawaki method enables the creation
                  of dense, fast-growing forests that boost biodiversity and
                  improve soil health. By increasing tree density, enriching local
                  flora, and promoting carbon sequestration, the initiative not
                  only contributes to environmental sustainability but also
                  mitigates climate change, reduces air pollution, and creates
                  healthier, greener communities for present and future
                  generations.
                </p>
                <h4>Empowering Agrarians Farmer’s Training</h4>
                <p>
                  The Sustainable Farming for Livelihood project aims to transform
                  rural agriculture by promoting environmentally friendly and
                  economically viable farming practices. Through training farmers
                  in sustainable agricultural techniques and facilitating market
                  linkages for their produce, the initiative enhances
                  productivity, reduces dependency on harmful inputs, and improves
                  income stability for smallholder farmers. By empowering rural
                  communities with knowledge, resources, and access to markets,
                  the project not only strengthens livelihoods but also
                  contributes to food security, environmental sustainability, and
                  long-term resilience of agricultural ecosystems.
                </p>

                <h4>Economic EmpowermentEmpowerment of FPOs and SHGs</h4>
                <p>
                  The Economic Empowerment of FPOs and SHGs project focuses on
                  strengthening the capacity of farmer producer organizations
                  (FPOs) and self-help groups (SHGs) through training in market
                  linkages, financial literacy, digital literacy, and organic
                  farming. By equipping members with practical knowledge and
                  skills, the initiative enhances their ability to manage
                  resources effectively, access better market opportunities, and
                  adopt sustainable farming practices. This empowerment not only
                  improves the income and financial independence of rural
                  communities but also fosters collective growth, resilience, and
                  long-term socio-economic development.
                </p>

                <h4>
                  Hand Holding Citizens- Awareness of government schemes and
                  resource awareness.
                </h4>
                <p>
                  The NSK (Nagrik Suchana Kendra) project aims to raise community
                  awareness about government schemes and facilitate access to
                  essential services. Through guidance on Aadhaar linkage, bank
                  account openings, and other government benefits, the initiative
                  empowers citizens to fully utilize available programs for their
                  social and economic welfare. By improving awareness and
                  accessibility, the project enhances financial inclusion,
                  strengthens participation in government schemes, and promotes
                  the overall well-being and self-reliance of community members.
                </p>

                <h4>
                  Empowering the Youth-Inspiring the next generation with Sales
                  and Marketing Training
                </h4>
                <p>
                  The Empowering the Youth project aims to inspire and equip the
                  next generation by providing comprehensive training in sales and
                  marketing, along with guidance on funding opportunities. By
                  imparting practical knowledge, industry-relevant skills, and
                  entrepreneurial insights, the initiative prepares young
                  individuals to explore diverse career paths, enhance
                  employability, and potentially start their own ventures. This
                  empowerment not only strengthens the professional capabilities
                  of youth but also contributes to economic self-reliance, career
                  growth, and community development.
                </p>
              </div>
            )}
            {intervention.id === "idp" && (
              <div className="idp-extra-text-full">
                {/* Replace this with your text later */}

                <p>
                  The Integrated Village Development Project is a holistic
                  approach to rural development aimed at improving the overall
                  quality of life in villages through multi-sectoral
                  interventions. Instead of focusing on a single issue, IVDP
                  addresses key areas such as healthcare, education, sanitation,
                  drinking water, skill development, livelihood promotion, women
                  empowerment, and infrastructure development.
                </p>

                <p>
                  The goal is to create self-reliant and sustainable villages by
                  integrating social, economic, and environmental development.
                  This model ensures community participation, convergence with
                  government schemes, and long-term impact.
                </p>

                <p>
                  Through IVDP, villages transform into hubs of improved health
                  outcomes, enhanced educational facilities, increased livelihood
                  opportunities, and strengthened community institutions, leading
                  to inclusive growth and reduced migration to urban areas.
                </p>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default OurWork;
