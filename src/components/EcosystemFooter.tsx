
import React from "react";
import { Link } from "react-router-dom";
import { Globe, Users, Database, Code, Book, Rocket } from "lucide-react";

const EcosystemFooter = () => {
  return (
    <footer className="bg-black/80 backdrop-blur-md border-t border-white/10 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white">Streamixy</h4>
            <p className="text-gray-400 text-sm">
              A decentralized creator economy powered by blockchain technology. 
              Connect directly with your audience, earn transparently, and own
              your digital assets.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Twitter
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Discord
              </a>
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Github
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Platform</h4>
            <ul className="space-y-3">
              <FooterLink to="/ecosystem" icon={<Globe className="h-4 w-4" />} label="Ecosystem" />
              <FooterLink to="/creator-tools" icon={<Code className="h-4 w-4" />} label="Creator Tools" />
              <FooterLink to="/documentation" icon={<Book className="h-4 w-4" />} label="Documentation" />
              <FooterLink to="/newsroom" icon={<Globe className="h-4 w-4" />} label="Newsroom" />
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Developers</h4>
            <ul className="space-y-3">
              <FooterLink to="/developer-hub" icon={<Code className="h-4 w-4" />} label="Developer Hub" />
              <FooterLink to="/ecosystem#grants" icon={<Rocket className="h-4 w-4" />} label="Grant Program" />
              <FooterLink to="/ecosystem#tokens" icon={<Database className="h-4 w-4" />} label="Token Creator" />
              <FooterLink to="/ecosystem#explorer" icon={<Database className="h-4 w-4" />} label="Explorer" />
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-4">Community</h4>
            <ul className="space-y-3">
              <FooterLink to="/creator-program" icon={<Users className="h-4 w-4" />} label="Creator Program" />
              <FooterLink to="/audience-program" icon={<Users className="h-4 w-4" />} label="Audience Program" />
              <FooterLink to="/foundation" icon={<Globe className="h-4 w-4" />} label="Foundation" />
              <FooterLink to="/careers" icon={<Rocket className="h-4 w-4" />} label="Careers" />
              <FooterLink to="/contact" icon={<Globe className="h-4 w-4" />} label="Contact" />
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Streamixy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <li>
    <Link to={to} className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors">
      {icon}
      {label}
    </Link>
  </li>
);

export default EcosystemFooter;
