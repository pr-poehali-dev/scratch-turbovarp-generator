
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface ProjectGeneratorProps {
  projectData: {
    title: string;
    description: string;
    url: string;
  };
}

export const ProjectGenerator = ({ projectData }: ProjectGeneratorProps) => {
  return (
    <Card className="mt-8 border-2 border-green-200 animate-fade-in">
      <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardTitle className="text-xl flex items-center gap-2">
          <Icon name="Sparkles" className="text-yellow-500" />
          Ваш проект готов: {projectData.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="aspect-video bg-gray-100 rounded-md mb-4 p-4 flex items-center justify-center border">
          <div className="text-center">
            <Icon name="Code" size={48} className="mx-auto mb-3 text-purple-400" />
            <p className="text-gray-500">Предпросмотр проекта</p>
          </div>
        </div>
        <p className="text-gray-700">{projectData.description}</p>
      </CardContent>
      <CardFooter className="flex gap-4 flex-wrap">
        <Button 
          className="flex-1" 
          onClick={() => window.open(projectData.url, '_blank')}
        >
          <Icon name="ExternalLink" className="mr-2 h-4 w-4" />
          Открыть проект
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => {
            navigator.clipboard.writeText(projectData.url);
            alert("Ссылка скопирована!");
          }}
        >
          <Icon name="Copy" className="mr-2 h-4 w-4" />
          Скопировать ссылку
        </Button>
      </CardFooter>
    </Card>
  );
};
