import { getTemplates } from "@/network";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Templates = () => {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getTemplates().then((templates) => setTemplates(templates));
  }, [templates, setTemplates]);

  return (
    <div className="px-2 pb-6">
      <div className="mx-auto max-w-4xl overflow-y-auto w-full">
        <ul
          role="list"
          className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {templates.map((template) => (
            <li
              className="group col-span-1 cursor-pointer divide-y divide-gray-200 rounded-lg border bg-white hover:shadow dark:border-gray-400 dark:bg-transparent"
              key={template.slug}
            >
              <Link href={`/${template.slug}`}>
                <div className="flex h-full w-full flex-col p-5">
                  <div>
                    <span className="inline-flex rounded-lg">
                      <Image
                        src={template.iconUrl}
                        width={32}
                        height={32}
                        className="h-8 w-8"
                        alt={template.title}
                        unoptimized
                      />
                    </span>
                  </div>
                  <h3 className="mt-2 truncate text-lg font-medium text-gray-900 group-hover:text-blue-600 dark:text-white">
                    {template.title}
                  </h3>

                  <p className="mt-1 text-gray-500">{template.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Templates;
