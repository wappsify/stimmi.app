import { Github } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-2 bg-primary text-secondary text-center">
      <div className="container mx-auto">
        <p className="prose text-sm mb-2">
          &copy; {new Date().getFullYear()} stimmi.app
        </p>
        <Button variant="ghost" size="sm" asChild>
          <a
            href="https://github.com/wappsify/stimmi.app"
            title="View source code on Github"
          >
            <Github />
          </a>
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
