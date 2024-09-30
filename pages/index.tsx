import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { LoginForm } from "@/components/ui/LoginForm";
import { Card } from "@nextui-org/card";

export default function IndexPage() {
  return (
    <div>
      <div className="w-full sm:h-[100vh] h-auto flex"  >
        <div className="w-1/2 h-full flex justify-center items-center " >
      <LoginForm/>
        </div>
        <div className="w-1/2 h-full p-2 overflow-hidden" >
         <img className="w-full h-auto rounded" alt="basquet" src="https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" ></img>
        </div>
      </div>
    </div>
  );
}
