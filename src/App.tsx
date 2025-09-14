import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Linkedin, Mail, ExternalLink, ChevronRight, Code, Smartphone, Layers, Star, Download, MapPin, Phone, Calendar, BookOpen, Award, Briefcase } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      // Update navbar style on scroll
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'skills', 'experience', 'education', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const height = element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section);
            break;
          }
        }
      }

      // Check for elements to animate on scroll
      const animateElements = document.querySelectorAll('.animate-on-scroll');
      animateElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isInView = rect.top <= window.innerHeight * 0.8;
        
        if (isInView) {
          setIsVisible(prev => ({...prev, [el.id]: true}));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check for elements in view
    setTimeout(() => {
      handleScroll();
    }, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  const skills = [
    { name: 'Flutter', level: 95 },
    { name: 'Dart', level: 90 },
    { name: 'GetX', level: 85 },
    { name: 'Provider', level: 85 },
    { name: 'Firebase', level: 90 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'RESTful APIs', level: 80 },
    { name: 'App Performance Optimization', level: 80 }
  ];

  const projects = [
    {
      title: 'Kivo VPN',
      description: 'A secure VPN application with advanced features for privacy and security, available on both iOS and Android platforms.',
      image: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['Flutter', 'Firebase', 'GetX', 'In-App Purchases'],
      platforms: ['iOS', 'Android'],
      links: {
        appStore: 'https://apps.apple.com/in/app/kivo-vpn/id6503701785',
        playStore: 'https://play.google.com/store/apps/details?id=com.bbws.kivo&hl=en_IN',
        github: '#'
      }
    },
    {
      title: 'AI Translator & Motivation Quotes',
      description: 'Translation application with offline capabilities using Google ML Kit, featuring daily motivation quotes.',
      image: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['Flutter', 'Google ML Kit', 'Firebase', 'RevenueCat'],
      platforms: ['iOS', 'Android'],
      links: {
        appStore: 'https://apps.apple.com/in/developer/blueberry-web-solutions-pvt-ltd/id1022756761',
        playStore: '#',
        github: '#'
      }
    },
    {
      title: 'PharmaBag',
      description: 'B2B platform for medicine wholesalers, facilitating connections between pharmacies and distributors.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['Flutter', 'RESTful API', 'Provider', 'Firebase'],
      platforms: ['Android'],
      links: {
        appStore: '#',
        playStore: 'https://play.google.com/store/apps/details?id=com.jaiswalpharma.pharmabag&hl=en',
        github: '#'
      }
    },
    {
      title: 'GTPL Broadband Provider',
      description: 'Application for a broadband service provider, allowing users to manage their accounts, check usage, and pay bills.',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      technologies: ['Flutter', 'Hive', 'RESTful API', 'Firebase'],
      platforms: ['iOS', 'Android'],
      links: {
        appStore: '#',
        playStore: '#',
        github: '#'
      }
    }
  ];

  const experiences = [
    {
      company: 'Blueberry Web Solution Pvt Ltd',
      position: 'Flutter Developer',
      period: 'October 2023 - Present',
      description: [
        'Led end-to-end development of iOS/Android apps, from advanced UI/UX design to deployment, managing projects independently.',
        'Developed and deployed 4+ major apps, including KiboVPN and Translator AI with offline translation using advanced Google ML Kit and Firebase services.',
        'Integrated state management tools like GetX, Provider, and Hive for efficient app functionality; utilized Firebase Analytics and Remote Config for real-time user behavior tracking and dynamic content updates.',
        'Implemented dynamic in-app purchases via RevenueCat and Superwall, enhancing app monetization.',
        'Ensured successful deployment on Play Store and App Store, optimizing performance, compliance, and leveraging Google AdMob for ad integration.'
      ]
    },
    {
      company: 'Mould Innovation',
      position: 'Junior Flutter Developer',
      period: 'February 2023 - October 2023',
      description: [
        'Developed and implemented beautiful, responsive UI layouts using Flutter, ensuring cross-platform compatibility.',
        'Worked on GTPL, a broadband provider app, and Pharmabag, a B2B platform for medicine wholesalers.',
        'Built and optimized complex UI components with a focus on user experience and performance.',
        'Integrated RESTful APIs to enable seamless data flow between the mobile app and backend services.'
      ]
    }
  ];

  const education = [
    {
      degree: 'Masters of Computer Application (MCA)',
      institution: 'Swami Vivekananda University',
      location: 'Kolkata, India',
      period: '2025 - ongoing'
    },
    {
      degree: 'Bachelor of Computer Application (BCA)',
      institution: 'Eminent College of Management And Technology',
      location: 'Barasat, India',
      period: '2023 - Completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative bg-gray-900 rounded-full p-1">
                  <Code className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Amit Barai</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-sm font-medium hover:text-cyan-400 transition-colors ${activeSection === link.id ? 'text-cyan-400' : 'text-gray-300'}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-300 hover:text-white">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md shadow-xl">
            <div className="container mx-auto px-6 py-4">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`block py-2 text-sm font-medium hover:text-cyan-400 transition-colors ${activeSection === link.id ? 'text-cyan-400' : 'text-gray-300'}`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center pt-16 overflow-hidden relative">
        {/* Background animated elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/20 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Amit Barai
                <span className="block bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Flutter Developer</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Transforming ideas into exceptional mobile experiences for iOS and Android platforms.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => scrollToSection('projects')}
                  className="relative group overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative flex items-center">
                    View Projects
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </span>
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="relative overflow-hidden border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-medium py-3 px-6 rounded-lg transition-all duration-300"
                >
                  <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                  <span className="relative">Contact Me</span>
                </button>
              </div>
              <div className="flex mt-8 space-x-4">
                <a href="https://www.linkedin.com/in/amitbarai-developer/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
                <a href="mailto:amitbarai.imt@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Mail className="h-6 w-6" />
                </a>
                <a href="tel:+916289641846" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  <Phone className="h-6 w-6" />
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center animate-fade-in">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center">
                  <Smartphone className="h-24 w-24 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll" id="about-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">About Me</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-on-scroll" id="about-image">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg blur opacity-25"></div>
                <div className="w-full h-80 bg-gray-800 rounded-lg overflow-hidden relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Developer working" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg p-4 shadow-lg z-20">
                  <div className="text-center">
                    <p className="text-3xl font-bold">2+</p>
                    <p className="text-sm">Years Experience</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 md:pl-12 animate-on-scroll" id="about-content">
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Flutter Developer with a passion for mobile excellence</h3>
              <p className="text-gray-300 mb-6">
                I'm Amit Barai, a passionate Flutter developer with a knack for transforming ideas into successful mobile applications. 
                With a solid foundation in computer science and ongoing research in IoT, I bring a creative, problem-solving approach 
                to every project.
              </p>
              <p className="text-gray-300 mb-6">
                I've successfully launched multiple apps on both the Play Store and App Store, including Kivo VPN and AI Translator. 
                As a smart worker and team player, I'm always exploring innovative ways to enhance productivity and technology.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center group">
                  <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors duration-300">
                    <MapPin className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="ml-3 text-sm md:text-base">North 24 P.G.S, Barasat, Kolkata - 700128</span>
                </div>
                <div className="flex items-center group">
                  <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors duration-300">
                    <Phone className="h-5 w-5 text-cyan-400" />
                  </div>
                  <span className="ml-3 text-sm md:text-base">+91 6289641846</span>
                </div>
                <div className="flex items-center group">
                  <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors duration-300">
                    <Mail className="h-5 w-5 text-cyan-400" />
                  </div>
                  <a href="mailto:amitbarai.imt@gmail.com" className="ml-3 text-sm md:text-base hover:text-cyan-400 transition-colors">amitbarai.imt@gmail.com</a>
                </div>
                <div className="flex items-center group">
                  <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors duration-300">
                    <Linkedin className="h-5 w-5 text-cyan-400" />
                  </div>
                  <a href="https://www.linkedin.com/in/amitbarai-developer/" target="_blank" rel="noopener noreferrer" className="ml-3 text-sm md:text-base hover:text-cyan-400 transition-colors">linkedin.com/in/amitbarai-developer</a>
                </div>
              </div>
              
              <button className="flex items-center bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-medium py-2 px-4 rounded-lg transition-colors">
                <Download className="mr-2 h-5 w-5" />
                Download Resume
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-3xl animate-blob"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-on-scroll" id="skills-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Technical Skills</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              My technical toolkit is focused on Flutter development and related technologies
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-on-scroll" id="skills-bars">
            {skills.map((skill, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors duration-300">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">{skill.name}</h3>
                  <span className="text-cyan-400">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: isVisible['skills-bars'] ? `${skill.level}%` : '0%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 animate-on-scroll" id="skills-cards">
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="font-medium mb-2 text-center">Mobile Development</h3>
              <p className="text-sm text-gray-400 text-center">Flutter, Dart, MVVM</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="font-medium mb-2 text-center">State Management</h3>
              <p className="text-sm text-gray-400 text-center">GetX, Provider, Hive</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="font-medium mb-2 text-center">3rd Party Integration</h3>
              <p className="text-sm text-gray-400 text-center">Superwall, RevenueCat, AdMob</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-cyan-400" />
              </div>
              <h3 className="font-medium mb-2 text-center">Firebase Services</h3>
              <p className="text-sm text-gray-400 text-center">Analytics, Remote Config, Push</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Experience Section */}
      <section id="experience" className="py-20 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll" id="experience-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Work Experience</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              My professional journey in Flutter development
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto animate-on-scroll" id="experience-timeline">
            {experiences.map((exp, index) => (
              <div key={index} className="mb-12 relative pl-8 md:pl-0">
                {/* Timeline for desktop */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-600 -translate-x-1/2"></div>
                
                <div className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start`}>
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 -translate-x-1/2 shadow-lg shadow-cyan-500/20"></div>
                  
                  {/* Mobile timeline */}
                  <div className="md:hidden absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-600"></div>
                  <div className="md:hidden absolute left-0 top-0 w-4 h-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 -translate-x-1/2 shadow-lg shadow-cyan-500/20"></div>
                  
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-700 hover:border-cyan-500/50 transition-colors duration-300">
                      <div className="flex items-center mb-2 md:justify-end">
                        <Briefcase className={`h-5 w-5 text-cyan-400 ${index % 2 === 0 ? 'md:order-2 md:ml-2' : 'mr-2'}`} />
                        <h3 className="text-xl font-bold">{exp.position}</h3>
                      </div>
                      <h4 className="text-cyan-400 font-medium mb-2">{exp.company}</h4>
                      <div className="flex items-center mb-4 md:justify-end">
                        <Calendar className={`h-4 w-4 text-gray-400 ${index % 2 === 0 ? 'md:order-2 md:ml-2' : 'mr-2'}`} />
                        <span className="text-sm text-gray-400">{exp.period}</span>
                      </div>
                      <ul className={`text-gray-300 space-y-2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex items-start">
                            <div className={`w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 ${index % 2 === 0 ? 'md:order-2 md:ml-2 md:flex-shrink-0' : 'mr-2 flex-shrink-0'}`}></div>
                            <p>{item}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Education Section */}
      <section id="education" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-on-scroll" id="education-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Education</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              My academic background and qualifications
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-on-scroll" id="education-cards">
            {education.map((edu, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{edu.degree}</h3>
                    <p className="text-cyan-400">{edu.institution}</p>
                  </div>
                </div>
                <div className="ml-16">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">{edu.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-300">{edu.period}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="max-w-4xl mx-auto mt-12 animate-on-scroll" id="education-research">
            <div className="bg-gray-800/70 backdrop-blur-sm p-8 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors duration-300">
              <div className="flex items-center mb-6">
                <Award className="h-8 w-8 text-cyan-400 mr-4" />
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Research & Ongoing Learning</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Currently pursuing my Masters in Computer Application (MCA) at Swami Vivekananda University, where I'm expanding my knowledge in advanced computing concepts and researching IoT applications.
              </p>
              <p className="text-gray-300">
                I'm continuously learning and staying updated with the latest Flutter developments, state management techniques, and mobile app optimization strategies to deliver cutting-edge solutions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll" id="projects-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Featured Projects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              A selection of my published applications available on App Store and Google Play
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-on-scroll" id="projects-cards">
            {projects.map((project, index) => (
              <div key={index} className="bg-gray-800/70 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg transition-all duration-500 hover:transform hover:scale-[1.02] group border border-gray-700 hover:border-cyan-500/50">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-400 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {project.platforms.map((platform, platformIndex) => (
                        <span key={platformIndex} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {project.links.appStore !== '#' && (
                      <a href={project.links.appStore} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-cyan-400 flex items-center transition-colors">
                        App Store <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                    {project.links.playStore !== '#' && (
                      <a href={project.links.playStore} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-cyan-400 flex items-center transition-colors">
                        Play Store <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 animate-on-scroll" id="contact-title">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Get In Touch</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto"></div>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Interested in working together? Feel free to reach out for collaborations or just a friendly hello
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto animate-on-scroll" id="contact-content">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 group">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors duration-300">
                    <Mail className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Email</h3>
                  <a href="mailto:amitbarai.imt@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors">amitbarai.imt@gmail.com</a>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg mb-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 group">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors duration-300">
                    <Phone className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Phone</h3>
                  <a href="tel:+916289641846" className="text-gray-400 hover:text-cyan-400 transition-colors">+91 6289641846</a>
                </div>
                
                <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-105 group">
                  <div className="bg-gradient-to-r from-cyan-500/20 to-purple-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:from-cyan-500 group-hover:to-purple-600 transition-colors duration-300">
                    <Linkedin className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">LinkedIn</h3>
                  <a href="https://www.linkedin.com/in/amitbarai-developer/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">linkedin.com/in/amitbarai-developer</a>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <form className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:border-cyan-500/50 transition-colors duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        className="w-full bg-gray-700 border border-gray-600 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-400/50 outline-none transition-colors duration-300"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                      <input 
                        type="email" 
                        id="email" 
                        className="w-full bg-gray-700 border border-gray-600 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-400/50 outline-none transition-colors duration-300"
                         placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      className="w-full bg-gray-700 border border-gray-600 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-400/50 outline-none transition-colors duration-300"
                      placeholder="Subject"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="w-full bg-gray-700 border border-gray-600 focus:border-cyan-400 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-400/50 outline-none resize-none transition-colors duration-300"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
                  >
                    <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                    <span className="relative">Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                <div className="relative bg-gray-900 rounded-full p-1">
                  <Code className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
              <span className="ml-3 text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">Amit Barai</span>
            </div>
            
            <div className="flex space-x-6">
              <a href="https://www.linkedin.com/in/amitbarai-developer/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:amitbarai.imt@gmail.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="tel:+916289641846" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Amit Barai. All rights reserved.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Add CSS animations */}
      <style jsx="true">{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;