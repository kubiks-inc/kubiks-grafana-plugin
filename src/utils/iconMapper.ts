// Import all SVG icons from the icons folder
import airflowIcon from '@/icons/airflow.svg'
import albIcon from '@/icons/alb.svg'
import argoCdIcon from '@/icons/argo-cd.svg'
import awsIcon from '@/icons/aws.svg'
import cloudflareIcon from '@/icons/cloudflare.svg'
import datadogIcon from '@/icons/datadog.svg'
import dotnetIcon from '@/icons/dotnet.svg'
import gcpIcon from '@/icons/gcp.svg'
import githubIcon from '@/icons/github.svg'
import gitlabIcon from '@/icons/gitlab.svg'
import golangIcon from '@/icons/golang.svg'
import grafanaIcon from '@/icons/grafana.svg'
import jiraIcon from '@/icons/jira.svg'
import kubernetesIcon from '@/icons/kubernetes.svg'
import kubiksIcon from '@/icons/kubiks.svg'
import lambdaIcon from '@/icons/lambda.svg'
import nginxIcon from '@/icons/nginx.svg'
import nodejsIcon from '@/icons/nodejs.svg'
import openaiIcon from '@/icons/openai.svg'
import postgresqlIcon from '@/icons/postgresql.svg'
import pubsubIcon from '@/icons/pubsub.svg'
import pythonIcon from '@/icons/python.svg'
import reactIcon from '@/icons/react.svg'
import rubyIcon from '@/icons/ruby.svg'
import s3Icon from '@/icons/s3.svg'
import salesforceIcon from '@/icons/salesforce.svg'
import shopifyIcon from '@/icons/shopify.svg'
import sonarqubeIcon from '@/icons/sonarqube.svg'
import sqsIcon from '@/icons/sqs.svg'
import statuspageIcon from '@/icons/statuspage.svg'
import stripeIcon from '@/icons/stripe.svg'
import vercelIcon from '@/icons/vercel.svg'
import wafIcon from '@/icons/waf.svg'

// Create a mapping object for easy lookup
const iconMap: Record<string, string> = {
    '/icons/airflow.svg': airflowIcon,
    '/icons/alb.svg': albIcon,
    '/icons/argo-cd.svg': argoCdIcon,
    '/icons/aws.svg': awsIcon,
    '/icons/cloudflare.svg': cloudflareIcon,
    '/icons/datadog.svg': datadogIcon,
    '/icons/dotnet.svg': dotnetIcon,
    '/icons/gcp.svg': gcpIcon,
    '/icons/github.svg': githubIcon,
    '/icons/gitlab.svg': gitlabIcon,
    '/icons/golang.svg': golangIcon,
    '/icons/grafana.svg': grafanaIcon,
    '/icons/jira.svg': jiraIcon,
    '/icons/kubernetes.svg': kubernetesIcon,
    '/icons/kubiks.svg': kubiksIcon,
    '/icons/lambda.svg': lambdaIcon,
    '/icons/nginx.svg': nginxIcon,
    '/icons/nodejs.svg': nodejsIcon,
    '/icons/openai.svg': openaiIcon,
    '/icons/postgresql.svg': postgresqlIcon,
    '/icons/pubsub.svg': pubsubIcon,
    '/icons/python.svg': pythonIcon,
    '/icons/react.svg': reactIcon,
    '/icons/ruby.svg': rubyIcon,
    '/icons/s3.svg': s3Icon,
    '/icons/salesforce.svg': salesforceIcon,
    '/icons/shopify.svg': shopifyIcon,
    '/icons/sonarqube.svg': sonarqubeIcon,
    '/icons/sqs.svg': sqsIcon,
    '/icons/statuspage.svg': statuspageIcon,
    '/icons/stripe.svg': stripeIcon,
    '/icons/vercel.svg': vercelIcon,
    '/icons/waf.svg': wafIcon,
}

export interface IconOption {
    label: string;
    value: string;
    iconUrl: string;
}

/**
 * Maps icon paths to properly imported SVG URLs
 * @param iconPath - The icon path (e.g., "/icons/cloudflare.svg")
 * @returns The imported SVG URL or undefined if not found
 */
export const getIconUrl = (iconPath: string): string | undefined => {
    return iconMap[iconPath]
}

/**
 * Gets the icon URL with fallback to the original path
 * @param iconPath - The icon path (e.g., "/icons/cloudflare.svg")
 * @returns The imported SVG URL or the original path as fallback
 */
export const getIconUrlWithFallback = (iconPath: string): string => {
    return iconMap[iconPath] || iconPath
}

/**
 * Gets all available icon options for dropdown display
 * @returns Array of icon options with labels, values, and URLs
 */
export const getIconOptions = (): IconOption[] => {
    return Object.entries(iconMap).map(([path, url]) => {
        // Extract the icon name from the path (e.g., "/icons/cloudflare.svg" -> "Cloudflare")
        const iconName = path
            .replace('/icons/', '')
            .replace('.svg', '')
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            label: iconName,
            value: path,
            iconUrl: url
        };
    }).sort((a, b) => a.label.localeCompare(b.label));
} 